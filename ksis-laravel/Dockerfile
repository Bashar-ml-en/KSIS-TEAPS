FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpq \
    zip \
    unzip \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    linux-headers \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy start script
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh && sed -i 's/\r$//' /usr/local/bin/start.sh

# Expose port
EXPOSE 8080

# Start command
CMD ["/usr/local/bin/start.sh"]
