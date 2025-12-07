#!/bin/sh
# Startup Script for Railway

echo "🚀 Starting Deployment..."

# Fallback Keys & DB Config (If Env Vars are missing)
# This guarantees connection even if Railway injection fails.
KNOWN_KEY="base64:siJquDUrxTdUN2gJ+AniHEUiywnnhP9ClDlqRXnwA1E="

# SUPABASE CREDENTIALS (FALLBACKS)
FB_DB_HOST="aws-1-ap-northeast-1.pooler.supabase.com"
FB_DB_PORT="6543"
FB_DB_DATABASE="postgres"
FB_DB_USERNAME="postgres.brpnempyimxftzlnouam"
FB_DB_PASSWORD="Ksisbackend123"

if [ -z "$APP_KEY" ]; then
    echo "⚠️ APP_KEY missing. Using fallback."
    APP_KEY="$KNOWN_KEY"
fi

# 0. SAFE .ENV GENERATION
echo "📄 Generating clean .env file..."
rm -f /var/www/html/.env
touch /var/www/html/.env

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

# Database Variables (Use Env Var if exists, else Fallback)
add_var "DB_CONNECTION" "${DB_CONNECTION:-pgsql}"
add_var "DB_HOST" "${DB_HOST:-$FB_DB_HOST}"
add_var "DB_PORT" "${DB_PORT:-$FB_DB_PORT}"
add_var "DB_DATABASE" "${DB_DATABASE:-$FB_DB_DATABASE}"
add_var "DB_USERNAME" "${DB_USERNAME:-$FB_DB_USERNAME}"
add_var "DB_PASSWORD" "${DB_PASSWORD:-$FB_DB_PASSWORD}"
add_var "DB_SSLMODE" "${DB_SSLMODE:-require}"

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
