#!/bin/bash

# Railway Build Script for Full-Stack Deployment
echo "🚀 Starting full-stack build..."

# Install backend dependencies
echo "📦 Installing Laravel dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Build frontend (if source exists)
if [ -d "../Frontend(KSIS)" ]; then
    echo "🎨 Building React frontend..."
    cd ../Frontend(KSIS)
    npm install
    npm run build
    
    # Copy to Laravel public directory
    echo "📋 Copying frontend build to Laravel public directory..."
    rm -rf ../Backend(KSIS)/ksis-laravel/public/app
    cp -r build/* ../Backend(KSIS)/ksis-laravel/public/app/
    
    cd ../Backend(KSIS)/ksis-laravel
fi

# Laravel optimization
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Build complete!"
