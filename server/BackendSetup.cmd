@echo off

REM Install Composer packages
REM composer install

REM Dump autoload packages of Composer
REM composer dump-autoload

REM Migrate all the tables
php artisan migrate

REM Migrate the seeder in order
php artisan db:seed

REM Clear all data in the project
php artisan config:clear
php artisan cache:clear
php artisan route:clear

REM Cache the data after clearing for optimization
php artisan config:cache
php artisan route:cache

REM Access uploaded file storage
REM php artisan storage:link

echo Script execution completed.
pause