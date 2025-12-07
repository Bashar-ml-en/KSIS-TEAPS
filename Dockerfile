# CACHE BUST: 2025-12-07-FIX-V4-FORCE-NEW-LAYER
# Stage 1: Build Frontend (Renamed to break cache)
FROM node:18-alpine as ksis_frontend_build_v1

WORKDIR /app/frontend

# Copy package.json
COPY frontend/package*.json ./

RUN npm install

# Copy frontend code
COPY frontend/ .

RUN npm run build

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

# Copy built frontend from RENAMED Stage 1
COPY --from=ksis_frontend_build_v1 /app/frontend/build ./public/app

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

EXPOSE 8080
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

CMD ["apache2-foreground"]
