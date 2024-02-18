<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\SecondaryId;

class SecondaryIdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $secondary_ids = [
            [
                'id' => Str::uuid(),
                'id_name' => 'TIN ID',
                'id_name_abbr' => 'TIN ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Postal ID (issued 2015 onwards)',
                'id_name_abbr' => 'Postal ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Barangay Certification',
                'id_name_abbr' => 'Barangay Certificate',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Government Service Insurance System (GSIS) e-Card',
                'id_name_abbr' => 'GSIS e-Card',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Seaman\'s Book',
                'id_name_abbr' => 'Seaman\'s Book',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Certification from the National Council for the Welfare of Disabled Persons (NCWDP)',
                'id_name_abbr' => 'PWD Certification',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Department of Social Welfare and Development (DSWD) Certification',
                'id_name_abbr' => 'DSWD Certification',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Company IDs issued by Private Entities or Institutions registered with or supervised or regulated either by the BSP, SEC or IC',
                'id_name_abbr' => 'Company ID',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Police Clearance',
                'id_name_abbr' => 'Police Clearance',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Barangay Clearance',
                'id_name_abbr' => 'Barangay Clearance',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Cedula or Community Tax Certificate',
                'id_name_abbr' => 'Cedula',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'Government Service Record',
                'id_name_abbr' => 'Government Service Record',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'PSA Marriage Contract',
                'id_name_abbr' => 'Marriage Contract',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'id_name' => 'PSA Birth Certificate',
                'id_name_abbr' => 'Birth Certificate',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        SecondaryId::insert($secondary_ids);

        /**
         * add more government id if expanding on other country
         * because this are the secondary id's for the philippines
         * just add countries table and get the id column
         * as the foreign key for the secondary_ids_list table
         */
    }
}
