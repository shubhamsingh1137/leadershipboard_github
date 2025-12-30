FROM php:8.2-apache

# 1. System dependencies aur PHP extensions install karein
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip xml bcmath

# 2. Apache rewrite enable karein
RUN a2enmod rewrite

# 3. Working directory set karein
WORKDIR /var/www/html

# 4. BACKEND folder ka content copy karein (Ye sabse zaroori hai)
# Kyunki aapki Dockerfile 'backend' folder ke bahar hai, isliye hume aise likhna hoga:
COPY ./backend /var/www/html

# 5. Composer install karein
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 6. Dependencies install karein
RUN composer install --no-interaction --optimize-autoloader --ignore-platform-reqs

# 7. Permissions set karein
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# 8. Apache configuration ko public folder par point karein
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

EXPOSE 80