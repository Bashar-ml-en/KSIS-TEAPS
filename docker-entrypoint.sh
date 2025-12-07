#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# 1. Runtime Port Config
PORT=${PORT:-8080}
echo "🔧 Configuring Apache for Port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. Clear Caches & Optimize (Running as root here)
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 3. Run Migrations
echo "📦 Running Migrations..."
php artisan migrate --force || echo "⚠️ Migration Failed! Check logs."

# 4. FIX PERMISSIONS (Must be LAST before startup)
# We do this AFTER artisan commands because artisan creates cache files as root.
# We must give them back to www-data so Apache can read/write them.
echo "🔐 Fixing Permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 5. Start Apache
echo "🔥 Starting Server..."
exec apache2-foreground
