<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\WarehouseType;

class WarehouseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $type_data = [
            [
                'id' => Str::uuid(),
                'name' => 'Distribution',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Cold Storage Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Consolidated Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Storage Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Hazmat Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Private Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Public Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Contract Type Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Fulfillment Center',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Transportation Type Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Bonded Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Smart Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Production Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Order Picking Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Logistics Type Warehouse',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        WarehouseType::insert($type_data);
    }
}
