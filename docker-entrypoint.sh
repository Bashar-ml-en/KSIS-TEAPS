#!/bin/sh
set -e

echo "🚀 Starting Deployment..."

# Fix permissions again just in case
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Clear ALL caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Run Migrations (Force correct schema on DB)
echo "📦 Running Migrations..."
php artisan migrate --force

# Create storage link
php artisan storage:link

# Start Apache
echo "🔥 Starting Apache..."
exec apache2-foreground
