<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insert initial user
        $initial_user = [
            [
                'id' => Str::uuid(),
                'username' => 'superadmin', // Change this to the desired username
                'email' => 'superadmin@test.com', // Change this to the desired email
                'password' => Hash::make('Test1234!'), // Change this to the desired password
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'admin', // Change this to the desired username
                'email' => 'admin@test.com', // Change this to the desired email
                'password' => Hash::make('Test1234!'), // Change this to the desired password
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'manager', // Change this to the desired username
                'email' => 'manager@test.com', // Change this to the desired email
                'password' => Hash::make('Test1234!'), // Change this to the desired password
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'username' => 'staff', // Change this to the desired username
                'email' => 'staff@test.com', // Change this to the desired email
                'password' => Hash::make('Test1234!'), // Change this to the desired password
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        User::insert($initial_user);

        $superadmin = Role::where('name', 'Super Admin')->first();
        $admin = Role::where('name', 'Administrator')->first();
        $manager = Role::where('name', 'Staff Manager')->first();
        $staff = Role::where('name', 'Staff')->first();

        $super_user = User::where('username', 'superadmin')->first();
        $admin_user = User::where('username', 'admin')->first();
        $manager_user = User::where('username', 'manager')->first();
        $staff_user = User::where('username', 'staff')->first();

        // insert the admin user on the table.
        $super_user->roles()->attach($superadmin->id);
        $admin_user->roles()->attach($admin->id);
        $manager_user->roles()->attach($manager->id);
        $staff_user->roles()->attach($staff->id);
    }
}
