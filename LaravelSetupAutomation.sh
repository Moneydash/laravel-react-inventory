# !/bin/bash -v

# proceed to server or the backend folder
cd server

# migrate all the tables
php artisan migrate

# migrate the seeder in order
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PrimaryIdSeeder
php artisan db:seed --class=SecondaryIdSeeder
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=NavigationSeeder
php artisan db:seed --class=SubNavigationSeeder
php artisan db:seed --class=EquipmentSeeder
php artisan db:seed --class=WarehouseTypeSeeder