# Use an official PHP runtime as a parent image
FROM php:7.4-apache

# Set the working directory to /app
WORKDIR /app

# Install required packages
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mysqli mbstring exif pcntl bcmath gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Enable Apache Rewrite module
RUN a2enmod rewrite

# Copy Laravel backend files to the container
COPY . /app

# Install Laravel dependencies
RUN composer install
