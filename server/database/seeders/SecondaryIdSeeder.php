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
                'description' => 'Not Applicable',
                'name' => 'N/A',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'TIN ID',
                'name' => 'TIN ID',
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Postal ID (issued 2015 onwards)',
                'name' => 'Postal ID',
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Barangay Certification',
                'name' => 'Barangay Certificate',
                'order' => 4,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Government Service Insurance System (GSIS) e-Card',
                'name' => 'GSIS e-Card',
                'order' => 5,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Seaman\'s Book',
                'name' => 'Seaman\'s Book',
                'order' => 6,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Certification from the National Council for the Welfare of Disabled Persons (NCWDP)',
                'name' => 'PWD Certification',
                'order' => 7,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Department of Social Welfare and Development (DSWD) Certification',
                'name' => 'DSWD Certification',
                'order' => 8,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Company IDs issued by Private Entities or Institutions registered with or supervised or regulated either by the BSP, SEC or IC',
                'name' => 'Company ID',
                'order' => 9,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Police Clearance',
                'name' => 'Police Clearance',
                'order' => 10,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Barangay Clearance',
                'name' => 'Barangay Clearance',
                'order' => 11,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Cedula or Community Tax Certificate',
                'name' => 'Cedula',
                'order' => 12,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'Government Service Record',
                'name' => 'Government Service Record',
                'order' => 13,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'PSA Marriage Contract',
                'name' => 'Marriage Contract',
                'order' => 14,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'description' => 'PSA Birth Certificate',
                'name' => 'Birth Certificate',
                'order' => 15,
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
