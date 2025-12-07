#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# 1. Runtime Port Config
PORT=${PORT:-8080}
echo "🔧 Configuring Apache for Port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. INJECT ENV VARS INTO APACHE (The Real Fix)
# We iterate over current vars and write them to Apache config so PHP sees them.
echo "💉 Injecting Environment Variables into Apache..."
printenv | sed 's/^\(.*\)=\(.*\)$/SetEnv "\1" "\2"/' > /etc/apache2/conf-enabled/railway-env.conf

# 3. Clear Caches & Optimize
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Run Migrations
echo "📦 Running Migrations..."
php artisan migrate --force || echo "⚠️ Migration Failed! Check logs."

# 5. FIX PERMISSIONS (Must be LAST)
echo "🔐 Fixing Permissions..."
rm -f /var/www/html/.env
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /etc/apache2/conf-enabled/railway-env.conf

# 6. Start Apache
echo "🔥 Starting Server..."
exec apache2-foreground
