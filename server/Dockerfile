# Use a php8.2 image
FROM php:8.2

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        wget \
        git \
        curl \
        default-mysql-client \
        libpng-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        build-essential \
        libssl-dev \
        zlib1g-dev \
        libjpeg-dev \
        libzip-dev \
        libxrender-dev \
        libfontconfig \
        libxext-dev \
        libsndfile1 \
        ffmpeg \
        zip \
        unzip \
        supervisor \
        sudo \
        nano

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
RUN wget -O /usr/local/bin/composer https://getcomposer.org/composer-stable.phar && chmod +x /usr/local/bin/composer

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the rest of the application code to the container
COPY . .

# Install dependencies
RUN composer install
RUN composer dump-autoload

# expose the port that is going to use by the backend
EXPOSE 8000

# Command to run the React app in build mode (for production)
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]