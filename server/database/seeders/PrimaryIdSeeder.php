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
                'id_name' => 'Philippine Passport from Department of Foreign Affairs',
                'id_name_abbr' => 'Philippine Passport',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'SSS UMID Card from Social Security System',
                'id_name_abbr' => 'SSS/UMID Card',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'GSIS UMID Card Government Service Insurance System',
                'id_name_abbr' => 'GSIS/UMID Card',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Driver\'s License from Land Transportation Office',
                'id_name_abbr' => 'Driver\'s License',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'OWWA ID Overseas Workers Welfare Administration',
                'id_name_abbr' => 'OWWA ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'iDOLE Card from Department of Labor and Employment',
                'id_name_abbr' => 'iDOLE Card',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Voter\'s ID from Commission on Elections',
                'id_name_abbr' => 'Voter\'s ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Voter\'s Certification from the Officer of Election with Dry Seal',
                'id_name_abbr' => 'Voter\'s Certificate',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Firearms License from Philippine National Police',
                'id_name_abbr' => 'Firearms License',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Senior Citizen ID from Local Government Unit',
                'id_name_abbr' => 'Senior Citizen ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Persons with Disabilities (PWD) ID from Local Government Unit',
                'id_name_abbr' => 'PWD ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'NBI Clearance from National Bureau of Investigation',
                'id_name_abbr' => 'NBI Clearance',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Alien Certification of Registration or Immigrant Certificate of Registration',
                'id_name_abbr' => 'Immigrant Certificate',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'PhilHealth ID (digitized PVC)',
                'id_name_abbr' => 'PhilHealth ID (digitized PVC)',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Government Office and GOCC ID',
                'id_name_abbr' => 'GOCC ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Integrated Bar of the Philippines ID',
                'id_name_abbr' => 'Integrated Bar of the Philippines ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Current Valid ePassport (For Renewal of ePassport)',
                'id_name_abbr' => 'Valid e-Passport',
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
