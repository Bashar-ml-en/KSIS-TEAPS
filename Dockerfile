# CACHE BUST: 2025-12-07-FIX-V5-FINAL
# Stage 1: Build Frontend
FROM node:18-alpine as frontend_build_stage

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ .

# Debugging: List files to confirm src exists
RUN ls -la

# Build
RUN npm run build

# Debugging: List build output to verify folder name (is it build or dist?)
RUN ls -la

# Stage 2: Serve Backend & Frontend
FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

RUN a2enmod rewrite

WORKDIR /var/www/html

COPY . .

# Copy built frontend from Stage 1 using the NEW STAGE NAME
# We expect /app/frontend/build based on vite.config.ts
COPY --from=frontend_build_stage /app/frontend/build ./public/app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

EXPOSE 8080
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

CMD ["apache2-foreground"]
