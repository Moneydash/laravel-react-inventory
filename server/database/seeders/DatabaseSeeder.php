<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            PrimaryIdSeeder::class,
            SecondaryIdSeeder::class,
            NavigationSeeder::class,
            SubNavigationSeeder::class,
            EquipmentSeeder::class,
            WarehouseTypeSeeder::class,
            CustomerTypeSeeder::class,
            IndustryTypeSeeder::class,
            LeadSourceSeeder::class,
            LeadTitleSeeder::class
        ]);
    }
}
