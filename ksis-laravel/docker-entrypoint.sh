#!/bin/sh
set -e

# Fix permissions for storage and cache directories
echo "Fixing permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

# Configure PHP-FPM to listen on port 9000 (Docker bridge network)
echo "Configuring PHP-FPM to listen on port 9000..."
sed -i 's/listen = 127.0.0.1:9000/listen = 9000/g' /usr/local/etc/php-fpm.d/www.conf

# Check if APP_KEY is set, if not generate it
if grep -q "APP_KEY=" .env && [ -z "$(grep "APP_KEY=" .env | cut -d '=' -f 2)" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate
fi

# Clear caches to avoid stale configuration
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Run migrations (optional, uncomment if desired)
# echo "Running migrations..."
# php artisan migrate --force

# Execute the main container command
echo "Starting PHP-FPM..."
exec "$@"
