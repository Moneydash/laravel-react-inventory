# !/bin/bash -v

# install composer on the project
# composer install

# dump autoload packages of composer
# composer dump-autoload

# migrate all the tables
php artisan migrate

# install passport
php artisan passport:install

# migrate the seeder in order
php artisan db:seed

# clear all data in the project
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# cache the data after clearing for optimization
php artisan config:cache
php artisan route:cache

# access uploaded file storage
# php artisan storage:link