#!/bin/bash

# Скрипт для тестирования фида на сервере
# Использование: ./test_feed_on_server.sh

echo "=== Тестирование фида на сервере ==="
echo ""

# Переходим в директорию проекта
cd /var/www/ta-feed || exit 1

echo "1. Проверка структуры данных..."
php artisan feed:test msk

echo ""
echo "2. Загрузка данных из фида..."
php artisan feed:fetch msk

echo ""
echo "3. Проверка сохраненных файлов..."
if [ -d "storage/app/feeds/msk" ]; then
    echo "✓ Файлы сохранены в storage/app/feeds/msk/"
    ls -lh storage/app/feeds/msk/
else
    echo "✗ Директория не найдена"
fi

echo ""
echo "4. Проверка данных в БД..."
php artisan tinker --execute="
echo 'Builders: ' . App\Models\Builder::count() . PHP_EOL;
echo 'Regions: ' . App\Models\Region::count() . PHP_EOL;
echo 'Subways: ' . App\Models\Subway::count() . PHP_EOL;
echo 'Blocks: ' . App\Models\Block::count() . PHP_EOL;
echo 'Buildings: ' . App\Models\Building::count() . PHP_EOL;
echo 'Apartments: ' . App\Models\Apartment::count() . PHP_EOL;
echo 'Rooms: ' . App\Models\Room::count() . PHP_EOL;
echo 'Finishings: ' . App\Models\Finishing::count() . PHP_EOL;
echo 'BuildingTypes: ' . App\Models\BuildingType::count() . PHP_EOL;
"

echo ""
echo "=== Тестирование завершено ==="
