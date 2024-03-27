<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Equipment;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment_data = [
            [
                'id' => Str::uuid(),
                'name' => 'Pallet Jacks',
                'description' => 'Pallet jacks make it easy to transport heavy materials that have been stacked on pallets. The pallet jack features two twin forks that slide underneath the pallet. A manual pallet jack requires the user to move the handle up and down with pumping force, which creates a hydraulic action that lifts the pallet.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Hand Trucks',
                'description' => 'Hand trucks are like pallet jacks in that they make it easier to transport large items throughout the warehouse. A hand truck consists of a metal frame, toe plate, and handles. The operator slides the toe plate under an object and tilts the handles back, allowing him to wheel the object to another spot in the warehouse. Hand trucks are suited to move smaller objects than pallet jacks, and do not utilize hydraulic action.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Order Picker Forklift',
                'description' => 'An order picker forklift helps operators to pick and transport materials that are needed to complete an order. They lift the forklift operator to the same level as the inventory. This makes order picking more efficient and safer than using manual equipment like a ladder which must be continuously moved and can easily shift on the operator.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Side Loader Forklift',
                'description' => 'A side loader is a forklift that is designed for use in tight spaces, such as narrow aisles but they tend to be less maneuverable than standard forklifts. The operator sits or stands in the machine depending on its design. Side loaders can operate inside or outside and run on either electric, diesel, or propane.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Automated Guided Vehicles',
                'description' => 'An automated guided vehicle (AGV) is warehouse material handling equipment that travels autonomously throughout a warehouse. AGVs are used for tasks that would typically require a forklift, conveyor system, or even a manual cart',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Cranes',
                'description' => 'Cranes are also commonly used warehouse material handling equipment. Warehouses may use a variety of cranes depending on their needs. Some commonly used cranes include stacker bridge cranes, gantry cranes, and jib cranes.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Platform Trucks',
                'description' => 'A platform truck is simply a flat sheet of metal with wheels on the bottom and a handle on one end to allow the operator to push or pull the truck. Some types of platform trucks can hold more than 2,500 lbs. When operating the platform truck, the operator must be careful to push the truck and not the merchandise that is resting on it. This can cause the merchandise to fall off the truck, resulting in broken goods or accidents.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Conveyor Belts',
                'description' => 'A conveyor belt is simply a motor-driven belt that is part of a larger conveyor system. Operators place items onto the belt. The belt rotates, moving items to their end location in the conveyor system.',
                'created_at' => now(),
                'updated_at' => now()
            ]
            // add more below
        ];

        Equipment::insert($equipment_data);
    }
}
