#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# Fallback for APP_KEY if Railway variable is missing (Fixes 500 Error)
KNOWN_KEY="base64:siJquDUrxTdUN2gJ+AniHEUiywnnhP9ClDlqRXnwA1E="
if [ -z "$APP_KEY" ]; then
    echo "⚠️ APP_KEY not provided by Environment. Using fallback Key."
    APP_KEY="$KNOWN_KEY"
fi

# 0. SAFE .ENV GENERATION
echo "📄 Generating clean .env file..."
rm -f /var/www/html/.env
touch /var/www/html/.env

# Function to safely append variable if it exists
add_var() {
    name=$1
    val=$2
    if [ -n "$val" ]; then
        echo "$name=\"$val\"" >> /var/www/html/.env
    fi
}

# Critical Laravel Variables
add_var "APP_NAME" "${LARAVEL_APP_NAME:-KSIS-TEAPS}"
add_var "APP_ENV" "${APP_ENV:-production}"
add_var "APP_KEY" "$APP_KEY"
add_var "APP_DEBUG" "${APP_DEBUG:-true}"
add_var "APP_URL" "$APP_URL"

# Database Variables
add_var "DB_CONNECTION" "${DB_CONNECTION:-pgsql}"
add_var "DB_HOST" "$DB_HOST"
add_var "DB_PORT" "$DB_PORT"
add_var "DB_DATABASE" "$DB_DATABASE"
add_var "DB_USERNAME" "$DB_USERNAME"
add_var "DB_PASSWORD" "$DB_PASSWORD"
add_var "DB_SSLMODE" "$DB_SSLMODE"

# Session & Auth
add_var "SESSION_DRIVER" "cookie"
add_var "SANCTUM_STATEFUL_DOMAINS" "$SANCTUM_STATEFUL_DOMAINS"

echo "✅ .env generation complete."

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

# 4. FIX PERMISSIONS (Must be LAST)
echo "🔐 Fixing Permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/.env

# 5. Start Apache
echo "🔥 Starting Server..."
exec apache2-foreground
