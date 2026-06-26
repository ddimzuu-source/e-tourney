# Stage 1: Build Frontend Assets
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Application Runtime
FROM php:8.2-fpm-alpine

# Install System Dependencies & PHP Extension Utilities
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    $PHPIZE_DEPS

# Install Ekstensi PHP MongoDB
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# Install Ekstensi PHP standard
RUN docker-php-ext-install bcmath mbstring pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set Working Directory
WORKDIR /var/www

# Copy Source Code
COPY . .

# Salin aset frontend hasil build dari Stage 1
COPY --from=frontend-builder /app/public/build ./public/build

# Install Backend Dependencies
RUN composer install --no-dev --optimize-autoloader

# Atur Izin Folder Storage & Cache
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy Nginx & Supervisor Config
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Jalankan optimize laravel
RUN php artisan config:cache && php artisan route:cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
