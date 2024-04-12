# Use a php8.2 image
FROM php:8.2

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        wget \
        git \
        libpq-dev \
        libsqlite3-dev \
        default-mysql-client \
        sudo \
        nano \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql pdo_sqlite

# Install Composer
RUN wget -O /usr/local/bin/composer https://getcomposer.org/composer-stable.phar && chmod +x /usr/local/bin/composer

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the rest of the application code to the container
COPY . .

# Install dependencies
RUN composer install
RUN composer dump-autoload

# Expose the port on which the app will run
EXPOSE 8000

# Run the automated backend setup script
# RUN chmod +x BackendSetup.sh
# RUN ./BackendSetup.sh

# Command to run the React app in build mode (for production)
ENTRYPOINT ["php", "artisan", "serve"]