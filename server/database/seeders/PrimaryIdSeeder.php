<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\PrimaryId;

class PrimaryIdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // insert primary id of the philippines
        $primary_ids = [
            [
                'id' => Str::uuid(),
                'description' => 'Philippine Passport from Department of Foreign Affairs',
                'name' => 'Philippine Passport',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'SSS UMID Card from Social Security System',
                'name' => 'SSS/UMID Card',
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'GSIS UMID Card Government Service Insurance System',
                'name' => 'GSIS/UMID Card',
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Driver\'s License from Land Transportation Office',
                'name' => 'Driver\'s License',
                'order' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'OWWA ID Overseas Workers Welfare Administration',
                'name' => 'OWWA ID',
                'order' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'iDOLE Card from Department of Labor and Employment',
                'name' => 'iDOLE Card',
                'order' => 6,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Voter\'s ID from Commission on Elections',
                'name' => 'Voter\'s ID',
                'order' => 7,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Voter\'s Certification from the Officer of Election with Dry Seal',
                'name' => 'Voter\'s Certificate',
                'order' => 8,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Firearms License from Philippine National Police',
                'name' => 'Firearms License',
                'order' => 9,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Senior Citizen ID from Local Government Unit',
                'name' => 'Senior Citizen ID',
                'order' => 10,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Persons with Disabilities (PWD) ID from Local Government Unit',
                'name' => 'PWD ID',
                'order' => 11,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'NBI Clearance from National Bureau of Investigation',
                'name' => 'NBI Clearance',
                'order' => 12,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Alien Certification of Registration or Immigrant Certificate of Registration',
                'name' => 'Immigrant Certificate',
                'order' => 13,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'PhilHealth ID (digitized PVC)',
                'name' => 'PhilHealth ID (digitized PVC)',
                'order' => 14,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Government Office and GOCC ID',
                'name' => 'GOCC ID',
                'order' => 15,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Integrated Bar of the Philippines ID',
                'name' => 'Integrated Bar of the Philippines ID',
                'order' => 16,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Current Valid ePassport (For Renewal of ePassport)',
                'name' => 'Valid e-Passport',
                'order' => 17,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        PrimaryId::insert($primary_ids);

        /**
         * add more government id if expanding on other country
         * because this are the primary id's for the philippines
         * just add countries table and get the id column
         * as the foreign key for the primary_ids_list table
         */
        
    }
}
