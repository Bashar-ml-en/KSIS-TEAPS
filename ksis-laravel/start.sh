#!/bin/sh
set -e

# Fix permissions
echo "Fixing permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

# Clear caches
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Start server
echo "Starting Laravel server on port ${PORT:-8080}..."
php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
