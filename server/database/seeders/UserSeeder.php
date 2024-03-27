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
            'username' => 'admin', // Change this to the desired username
            'email' => 'test@test.com', // Change this to the desired email
            'password' => Hash::make('Test1234!'), // Change this to the desired password
            'status' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $user = User::create($initial_user);
        $role_admin = Role::where('role_name', 'Administrator')->first();

        // insert the admin user on the table.
        $user->roles()->attach($role_admin->id);
    }
}
