#!/bin/bash

# Скрипт для настройки проекта на сервере
# Выполните на сервере после копирования архива

SERVER_PATH="/var/www/ta-feed"
ARCHIVE="/tmp/ta-feed-deploy.tar.gz"

echo "=== Настройка проекта на сервере ==="

# 1. Создание папки
echo "1. Создание папки..."
mkdir -p $SERVER_PATH
cd $SERVER_PATH

# 2. Распаковка архива
if [ -f "$ARCHIVE" ]; then
    echo "2. Распаковка архива..."
    tar -xzf $ARCHIVE
    echo "Архив распакован"
else
    echo "Ошибка: Архив $ARCHIVE не найден!"
    echo "Скопируйте архив на сервер в /tmp/"
    exit 1
fi

# 3. Установка зависимостей
echo "3. Установка зависимостей Composer..."
if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader
    echo "Зависимости установлены"
else
    echo "Ошибка: Composer не установлен!"
    exit 1
fi

# 4. Настройка .env
echo "4. Настройка .env файла..."
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
    echo ".env файл создан"
    echo "ВАЖНО: Отредактируйте .env файл с настройками базы данных!"
else
    echo ".env файл уже существует"
fi

# 5. Установка прав доступа
echo "5. Установка прав доступа..."
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || chown -R nginx:nginx storage bootstrap/cache 2>/dev/null
echo "Права доступа установлены"

# 6. Выполнение миграций
echo "6. Выполнение миграций..."
php artisan migrate --force
echo "Миграции выполнены"

# 7. Очистка
echo "7. Очистка..."
rm -f $ARCHIVE
echo "Временные файлы удалены"

echo ""
echo "=== Настройка завершена ==="
echo ""
echo "Следующие шаги:"
echo "1. Отредактируйте .env файл с настройками базы данных"
echo "2. Выполните тесты: php artisan feed:test msk"
echo "3. Загрузите данные: php artisan feed:fetch msk"
echo "4. Проверьте целостность: php artisan feed:validate"
