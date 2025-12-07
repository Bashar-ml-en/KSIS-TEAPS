# CACHE BUST: 2025-12-07-FIX-V5-FINAL
# Stage 1: Build Frontend
FROM node:18-alpine as ksis_frontend_build_v1

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# Debugging: List files to confirm src exists
RUN ls -la

# Build
RUN npm run build

# Stage 2: Serve Backend & Frontend
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Force PHP to read Environment Variables (Fixes SQLite fallback)
RUN echo "variables_order = \"EGPCS\"" > /usr/local/etc/php/conf.d/custom.ini


RUN a2enmod rewrite

WORKDIR /var/www/html

COPY . .

# Copy built frontend assets to public/assets (so browser can find them)
COPY --from=ksis_frontend_build_v1 /app/frontend/build/assets ./public/assets
# Copy index.html to public/app so Laravel routes can serve it
COPY --from=ksis_frontend_build_v1 /app/frontend/build/index.html ./public/app/index.html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

EXPOSE 8080

# Note: Port configuration is handled in docker-entrypoint.sh at runtime

# Copy and set entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
# Fix Windows line endings causing exec errors and make executable
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Start command using entrypoint
CMD ["docker-entrypoint.sh"]
