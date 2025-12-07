#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# 1. Runtime Port Config (Fixes 'Failed to respond' error)
# Railway injects $PORT at runtime. We replace 80 with this port.
PORT=${PORT:-8080}
echo "🔧 Configuring Apache for Port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. Fix Permissions
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 3. Clear Caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Run Migrations (Non-fatal)
echo "📦 Running Migrations..."
# We allow failure (|| true) here so the container doesn't crash if DB is wrong.
# This lets us see the actual error page/logs instead of "Application Failed".
php artisan migrate --force || echo "⚠️ Migration Failed! Check logs."

# 5. Start Apache
echo "🔥 Starting Server..."
exec apache2-foreground
