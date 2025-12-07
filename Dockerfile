# Stage 1: Build Frontend
FROM node:18-alpine as frontend

# Set working directory to where we copied the frontend code
WORKDIR /app/frontend

# Copy package.json from the frontend folder
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY frontend/ .

# Build the React application
RUN npm run build

# Stage 2: Serve Backend & Frontend
FROM php:8.2-apache

# Install dependencies (PostgreSQL, Zip, etc)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy backend files (root of the repo)
COPY . .

# Copy built frontend from Stage 1 to public/app folder
# Note: we copy from /app/frontend/build because that matches outDir in vite.config.ts
COPY --from=frontend /app/frontend/build ./public/app

# Install PHP dependencies
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Apache DocumentRoot to point to public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Expose port (Internal Railway Port)
EXPOSE 8080

# Configure Apache to listen on $PORT provided by Railway
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Start command
CMD ["apache2-foreground"]
