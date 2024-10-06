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
            CategorySeeder::class,
            RoleSeeder::class,
            PrimaryIdSeeder::class,
            SecondaryIdSeeder::class,
            UserSeeder::class,
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
