<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\UserRegistrationMail;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;


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

        $staff_role = Role::where('role_name', 'Staff')->first();

        try {
            $user = User::create([
                'username' => $request->username,
                'email' => strtolower($request->email),
                'password' => Hash::make($request->password)
            ]);

            $user->roles()->attach($staff_role->id);

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
        // Validate the user's input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // If the validation fails, return the validation errors
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Check if the user exists and is active
        $user = User::where('email', $request->email)->where('status', 1)->first();
        if (!$user) {
            // Authentication failed, return an error response
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Authentication passed, return a success response
            $user = Auth::user();
            $user->load('roles'); // load the role of the user

            $token = $user->createToken(date('Y-m-d h:i:s').'|'.$user->id)->plainTextToken;

            // Set the token's expiration time
            $expirationMinutes = 180; // 3hrs
            $user->tokens->each(function ($token) use ($expirationMinutes) {
                $token->forceFill([
                    'expires_at' => now()->addMinutes($expirationMinutes),
                ])->save();
            });
            
            return response()->json([
                'message' => 'Successfully logged in!',
                'user' => Auth::user(), 'access_token' => $token,
                'expire_at' => $expirationMinutes
            ]);
            
        } else {
            // Authentication failed, return an error response
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    }

    public function logout(Request $request) {
        $user = $request->user();
        $user->currentAccessToken()->delete();
        Cache::flush();

        return response()->json([ 'message' => 'Successfully logged out.' ]);
    }

    public function get_users_list() {
        $users = User::where('status', 1)
        ->with('roles')
        ->get();
        
        return response()->json([ 'users_list' => $users ]);
    }

    public function get_roles() {
        $roles = Role::where('role_status', 1)->get();

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

        // for mailing and sending the unhash password on the email
        $user_data_mail = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => $randomString,
            'role' => $role->role_name
        ];

        $user_data = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($randomString),
            'status' => 1
        ];

        DB::beginTransaction();
        try {
            $userData = User::create($user_data);
            $userData->roles()->attach($request->role);

            $user = User::where('username', $request->username)
            ->with('roles')
            ->first();

            Mail::to($user->email)->send(new UserRegistrationMail($user_data_mail));

            DB::commit();
            return response()->json([ 'message' => 'User registered successfully. They can check their email for user credentials.' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function get_user($user_id) {
        $user = User::where('id', $user_id)
        ->where('status', 1)
        ->with('roles')
        ->first();

        if (!$user) {
            return response()->json([ 'message' => 'User not found.' ], 404);
        }

        // create a new class instance for user, excluding the password for security purposes
        $user_data = new User();
        $user_data->id = $user->id;
        $user_data->username = $user->username;
        $user_data->email = $user->email;
        $user_data->role = $user->roles[0]['id'];
        $user_data->role_name = $user->roles[0]['role_name'];

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

            DB::commit();
            return response()->json([ 'message' => 'User role has been updated!' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function disable_user($user_id) {
        DB::beginTransaction();

        try {
            $user = User::where('id', $user_id)
            ->where('status', 1);

            $user->status = 0;
            $user->save();

            DB::commit();
            return response()->json([ 'message' => 'User account has been disabled' ]);
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
            $user = User::findOrFail($user_id)
            ->where('status', 1)
            ->first();

            if ($request->username != $user->username) {
                $user->username = $request->username;
            }

            if ($request->email != $user->email) {
                $user->email = $request->email;
            }

            $user->save();

            DB::commit();
            return response()->json([ 'message' => 'Account has been updated successfully!' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    public function change_password($user_id, Request $request) {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required'
        ]);

        $user = User::findOrFail($user_id)
        ->where('status', 1)
        ->first();

        DB::beginTransaction();
        try {
            if (Hash::check($request->old_password, $user->password)) {
                $user->password = Hash::make($request->new_password);
                $user->save();

                DB::commit();
                return response()->json([ 'message' => 'Password has successfully updated!' ]);
            } else {
                return response()->json([ 'error' => 'Current password is incorrect!' ], 422);
            }
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }
}