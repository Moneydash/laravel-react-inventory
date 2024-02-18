<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('category')->insert([
            [ 'category_name' => 'Goods', 'created_at' => now(), 'updated_at' => now() ],
            [ 'category_name' => 'Stationary', 'created_at' => now(), 'updated_at' => now() ]
            // add more categories if expanding
        ]);
    }
}
