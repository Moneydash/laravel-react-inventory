<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistrationMail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;
use Laravel\Passport\TokenRepository;
use Laravel\Passport\ClientRepository;
use League\OAuth2\Server\AuthorizationServer;
use Laravel\Passport\Passport;

class UserController extends Controller
{
    // registration of staffs only
    public function register_user(Request $request) {
        $request->validate([
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:15'
        ]);

        DB::beginTransaction();

        $staff_role = Role::where('name', 'Staff')->first();

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => strtolower($request->email),
                'password' => Hash::make($request->password)
            ]);

            $user->roles()->attach($staff_role->id);

            if ($user) {
                # track add user
                AuditTrail::create([
                    'user_id' => auth()->user()->id ?? null,
                    'action' => 'add',
                    'description' => 'Added a new user. ID: ' . $user->id
                ]);
            }

            DB::commit();
            return response()->json([
                'message' => 'You are successfully registered!',
                'user' => $request->email
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => 'Error occur, please try again later.' ]);
        }
    }

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $user->load('roles');

            $tokenResult = $user->createToken('Personal Access Token');

            // Get the access token
            $accessToken = $tokenResult->accessToken;

            // Check if the token object exists before setting the expiration
            if ($tokenResult->token) {
                $tokenResult->token->expires_at = now()->addMinutes(180); // Set token expiration to 3 hours
                $tokenResult->token->save();
            }

            # track login user
            AuditTrail::create([
                'user_id' => $user->id,
                'action' => 'login',
                'description' => 'Logged in to the system.'
            ]);

            // Return the access token as part of the response
            return response()->json([
                'message' => 'Successfully logged in!',
                'user' => $user,
                'access_token' => $accessToken, // Passport's access token
                'expires_at' => 180
            ]);
        } else {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function logout(Request $request) {
        $user = $request->user();
        
        // Revoke the user's current access token
        $token = $user->token();
        $token->revoke();
        
        // get the user and role id of the user
        $username = $request->user()->username;
        $user_data = User::where('username', $username)
        ->with('roles')
        ->first();

        # track logout user
        AuditTrail::create([
            'user_id' => $user->id,
            'action' => 'logout',
            'description' => 'Logged out of the system.'
        ]);
        
        $role_id = $user_data->roles[0]->pivot->role_id;
        $user_id = $user_data->roles[0]->pivot->user_id;

        // delete all the cache that is related to the user
        Cache::tags($role_id . '_' . $user_id)->flush();

        return response()->json([ 'message' => 'Successfully logged out.', 'role_id' => $role_id ]);
    }

    public function get_users_list(Request $request) {
        # Retrieve query parameters with default values
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');
    
        $query = User::with('roles');
    
        // Check if the authenticated user has the Administrator role
        if (auth()->user()->hasRole('Administrator')) {
            // Exclude users with Super Admin role
            $superAdminRole = Role::where('name', 'Super Admin')->first();
            if ($superAdminRole) {
                $query->whereDoesntHave('roles', function ($q) use ($superAdminRole) {
                    $q->where('roles.id', $superAdminRole->id);
                });
            }
        }
    
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
    
        # track get users list
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all users.'
        ]);
    
        $users = $query->paginate($perPage, ['*'], 'page', $page);
        return response()->json([ 'users_list' => $users ]);
    }

    public function get_roles() {
        if (auth()->user()->hasRole('Super Admin')) {
            $roles = Role::get();
        } else {
            $roles = Role::where('name', '!=', 'Super Admin')->get();
        }

        return response()->json([ 'roles' => $roles ]);
    }

    public function create_user(Request $request) {
        $request->validate([
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'role' => 'required'
        ], [
            'username.required' => 'The username field is required.',
            'username.unique' => 'The username is already registered',
            'email.required' => 'The email field is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'role.required' => 'Please select a role.'
        ]);

        // Define a pool of characters for password generation
        $password_length = 15;
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_';
        $shuffledChars = str_shuffle($characters); // Shuffle the characters
        $randomString = substr($shuffledChars, 0, $password_length);
        $role = Role::where('id', $request->role)->first();

        if (!$role) {
            return response()->json(['error' => 'Role not found.'], 404);
        }

        // for mailing and sending the unhash password on the email
        $user_data_mail = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => $randomString,
            'role' => $role->name
        ];

        $user_data = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($randomString)
        ];

        DB::beginTransaction();
        try {
            $userData = User::create($user_data);
            $userData->roles()->attach($request->role);

            $user = User::where('username', $request->username)
            ->with('roles')
            ->first();

            Mail::to($user->email)->send(new UserRegistrationMail($user_data_mail));

            # track create user
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'create',
                'description' => 'Created a new user. ID: ' . $user->id
            ]);

            DB::commit();
            return response()->json([ 'message' => 'User registered successfully. They can check their email for user credentials.' ]);
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('User Creation failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    public function get_user($user_id) {
        $user = User::where('id', $user_id)
            ->with('roles')
            ->first();

        if (!$user) {
            return response()->json([ 'message' => 'User not found.' ], 404);
        }

        // Extract necessary user information
        $user_data = [
            'id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->roles[0]['id'],
            'role_name' => $user->roles[0]['name']
        ];

        # track get user
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'get',
            'description' => 'Retrieved user details. ID: ' . $user->id
        ]);

        return response()->json([ 'user_info' => $user_data ]);
    }

    public function update_user_role($user_id, Request $request) {
        $request->validate([ 'role' => 'required' ]);

        DB::beginTransaction();
        try {
            $user = User::where('id', $user_id)->with('roles')->first();

            // check if the user has any roles before detaching
            if (!empty($user->roles)) {
                $user->roles()->detach($user->roles[0]['id']); // detach the assigned roles first
            }
            
            $user->roles()->attach($request->role); // attach the new assigned roles

            # track update user role
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Updated user role. User ID: ' . $user->id
            ]);

            DB::commit();
            return response()->json([ 'message' => 'User role has been updated!' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function remove_user($user_id) {
        DB::beginTransaction();

        try {
            $user = User::where('id', $user_id)->first();

            if (!$user) {
                return response()->json([ 'error_message' => 'User not found.' ], 404);
            }

            # track remove user
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'remove',
                'description' => 'Removed user. User ID: ' . $user->id
            ]);

            # soft delete the user
            $user->delete();
            DB::commit();

            return response()->json([ 'message' => 'User account has been removed.' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function update_account($user_id, Request $request) {
        $request->validate([
            'username' => 'required|unique:users,username,' . $user_id,
            'email' => 'required|email|unique:users,email,' . $user_id
        ]);

        DB::beginTransaction();
        try {
            $user = User::findOrFail($user_id)->first();

            if (!$user) {
                return response()->json([ 'error' => 'User not found.' ], 404);
            }

            if ($request->username != $user->username) {
                $user->username = $request->username;
            }

            if ($request->email != $user->email) {
                $user->email = $request->email;
            }

            # track update user account
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Updated user account. ID: ' . $user->id
            ]);

            $user->save();
            DB::commit();

            return response()->json([ 'message' => 'Account has been updated successfully!' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ], 404);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ], 400);
        }
    }

    public function change_password($user_id, Request $request) {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required'
        ]);

        $user = User::findOrFail($user_id)->first();

        if (!$user) {
            return response()->json([ 'error' => 'User not found.' ], 404);
        }

        DB::beginTransaction();
        try {
            if (Hash::check($request->old_password, $user->password)) {
                $user->password = Hash::make($request->new_password);
                $user->save();

                # track change password
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'update',
                    'description' => 'Changed user password. ID: ' . $user->id
                ]);

                DB::commit();
                return response()->json([ 'message' => 'Password has successfully updated!' ]);
            } else {
                return response()->json([ 'error' => 'Current password is incorrect!' ], 422);
            }
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }
}