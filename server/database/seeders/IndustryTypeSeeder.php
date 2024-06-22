<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\IndustryType;

class IndustryTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $industry_data = [
            [
                'id' => Str::uuid(),
                'name' => 'Agriculture',
                'description' => 'Includes farming, crop cultivation, livestock raising, and related activities involved in producing food, fiber, and other agricultural products.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Mining',
                'description' => 'Involves the extraction of minerals, metals, and other natural resources from the earth, including activities such as mining, quarrying, and oil and gas extraction.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Manufacturing',
                'description' => 'Encompasses the production of goods through various processes, such as assembly, fabrication, and processing, across a wide range of sectors including automotive, electronics, textiles, and machinery.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Construction',
                'description' => 'Involves the construction of buildings, infrastructure, and other structures, including residential, commercial, and industrial projects, as well as civil engineering and heavy construction.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Transportation',
                'description' => 'Includes businesses involved in the movement of goods and people, such as airlines, railways, shipping companies, trucking firms, and logistics providers.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Retail',
                'description' => 'Comprises businesses engaged in the sale of goods directly to consumers through various channels, including brick-and-mortar stores, e-commerce platforms, and catalog sales.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Hospitality',
                'description' => 'Encompasses businesses that provide lodging, dining, entertainment, and other services to travelers and tourists, including hotels, restaurants, bars, casinos, and amusement parks.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Financial Services',
                'description' => 'Involves businesses that provide financial products and services, including banking, insurance, investment management, and other financial activities.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Health Care',
                'description' => 'Includes organizations involved in providing medical services, healthcare products, pharmaceuticals, and medical devices, as well as healthcare facilities such as hospitals, clinics, and nursing homes.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Technology',
                'description' => 'Comprises businesses involved in the development, manufacture, and distribution of technology products and services, including software, hardware, telecommunications, and information technology.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Energy',
                'description' => 'Involves the production, distribution, and consumption of energy resources, including electricity, natural gas, oil, renewable energy sources, and utilities.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Education',
                'description' => 'Encompasses educational institutions, including schools, colleges, universities, and vocational training centers, as well as companies providing educational products and services.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Media and Entertainment',
                'description' => 'Includes businesses involved in the creation, production, distribution, and consumption of media content, such as television, film, music, publishing, and digital media.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Real Estate',
                'description' => 'Involves the buying, selling, leasing, and development of real property, including residential, commercial, and industrial properties, as well as real estate brokerage and property management.',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'name' => 'Professional',
                'description' => 'Comprises businesses that provide specialized services to other businesses or individuals, such as legal services, consulting, accounting, engineering, and marketing.',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        IndustryType::insert($industry_data);
    }
}
