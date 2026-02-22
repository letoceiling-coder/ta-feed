#!/bin/bash
# Скрипт для автоматического развертывания на сервере
# Выполните на сервере после копирования архива

SERVER_PATH="/var/www/ta-feed"
ARCHIVE="/tmp/ta-feed-deploy.tar.gz"
PASSWORD="CJGd6u7u(yA!"

echo "=== Автоматическое развертывание проекта ==="

# Проверка наличия архива
if [ ! -f "$ARCHIVE" ]; then
    echo "Ошибка: Архив $ARCHIVE не найден!"
    echo "Сначала скопируйте архив на сервер"
    exit 1
fi

# Создание папки
echo "1. Создание папки..."
mkdir -p $SERVER_PATH
cd $SERVER_PATH

# Распаковка
echo "2. Распаковка архива..."
tar -xzf $ARCHIVE
echo "✓ Архив распакован"

# Проверка Composer
if ! command -v composer &> /dev/null; then
    echo "Ошибка: Composer не установлен!"
    echo "Установите Composer: curl -sS https://getcomposer.org/installer | php"
    exit 1
fi

# Установка зависимостей
echo "3. Установка зависимостей..."
composer install --no-dev --optimize-autoloader
echo "✓ Зависимости установлены"

# Настройка .env
echo "4. Настройка .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
    echo "✓ .env файл создан"
    echo "⚠ ВАЖНО: Отредактируйте .env файл с настройками БД!"
else
    echo "✓ .env файл уже существует"
fi

# Права доступа
echo "5. Установка прав доступа..."
chmod -R 755 storage bootstrap/cache
if id "www-data" &>/dev/null; then
    chown -R www-data:www-data storage bootstrap/cache
elif id "nginx" &>/dev/null; then
    chown -R nginx:nginx storage bootstrap/cache
fi
echo "✓ Права установлены"

# Миграции
echo "6. Выполнение миграций..."
php artisan migrate --force
echo "✓ Миграции выполнены"

# Очистка
echo "7. Очистка..."
rm -f $ARCHIVE
echo "✓ Временные файлы удалены"

echo ""
echo "=== Развертывание завершено ==="
echo ""
echo "Следующие шаги:"
echo "1. Отредактируйте .env: nano $SERVER_PATH/.env"
echo "2. Тест структуры: cd $SERVER_PATH && php artisan feed:test msk"
echo "3. Загрузка данных: php artisan feed:fetch msk"
echo "4. Проверка: php artisan feed:validate"
