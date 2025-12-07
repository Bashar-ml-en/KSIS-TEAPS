#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# 0. FORCE .ENV GENERATION (The Ultimate Fix for Missing Env Vars)
# This takes all runtime environment variables injected by Railway/Docker
# and writes them to the .env file so Laravel can read them as a FILE.
# This bypasses all php.ini / Apache environment passing issues.
echo "📄 Generating .env file from environment variables..."
printenv > /var/www/html/.env

# 1. Runtime Port Config
PORT=${PORT:-8080}
echo "🔧 Configuring Apache for Port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. Clear Caches & Optimize
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 3. Run Migrations
echo "📦 Running Migrations..."
php artisan migrate --force || echo "⚠️ Migration Failed! Check logs."

# 4. FIX PERMISSIONS (Must be LAST before startup)
echo "🔐 Fixing Permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/.env

# 5. Start Apache
echo "🔥 Starting Server..."
exec apache2-foreground
