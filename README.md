# TA Feed - Система работы с фидом TrendAgent

Система для загрузки и работы с данными о недвижимости из фида TrendAgent.

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
composer install
```

3. Настройте `.env` файл:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ta_feed
DB_USERNAME=root
DB_PASSWORD=
```

4. Выполните миграции:
```bash
php artisan migrate
```

## Использование

### Загрузка данных из фида

Для загрузки данных из фида используйте команду:

```bash
php artisan feed:fetch {region}
```

Доступные регионы:
- `msk` - Москва
- `spb` - Санкт-Петербург
- `krasnodar` - Краснодар
- `nsk` - Новосибирск
- `rostov` - Ростов-на-Дону
- `kzn` - Казань
- `ekb` - Екатеринбург
- `crimea` - Крым

Пример:
```bash
php artisan feed:fetch msk
```

Команда:
1. Загружает все данные из фида для указанного региона
2. Сохраняет ответы API в файлы в `storage/app/feeds/{region}/`
3. Загружает данные в базу данных

**Важно:** Запросы к фиду должны выполняться с сервера, IP которого добавлен в белый список.

### Работа с данными

#### Использование FilterService

```php
use App\Services\FilterService;

$filterService = new FilterService();

// Фильтрация квартир
$apartments = $filterService->filterApartments([
    'price_min' => 5000000,
    'price_max' => 10000000,
    'area_min' => 30,
    'area_max' => 60,
    'room_id' => 1,
    'finishing_id' => 2,
    'block_id' => 123,
    'builder_id' => 45,
    'region_id' => 1,
    'subway_id' => 5,
])->get();

// Фильтрация ЖК
$blocks = $filterService->filterBlocks([
    'builder_id' => 45,
    'region_id' => 1,
    'subway_id' => 5,
])->get();

// Фильтрация корпусов
$buildings = $filterService->filterBuildings([
    'block_id' => 123,
    'building_type_id' => 2,
])->get();
```

#### Использование моделей

```php
use App\Models\Apartment;
use App\Models\Block;
use App\Models\Building;

// Получить квартиру с отношениями
$apartment = Apartment::with(['building.block', 'room', 'finishing'])->find(1);

// Получить ЖК с застройщиком и регионами
$block = Block::with(['builder', 'regions', 'subways'])->find(1);

// Получить корпус с ЖК и квартирами
$building = Building::with(['block', 'apartments'])->find(1);
```

## Структура проекта

```
app/
├── Console/
│   └── Commands/
│       └── FetchFeedData.php      # Команда для загрузки данных
├── Models/
│   ├── Apartment.php               # Модель квартиры
│   ├── Block.php                   # Модель ЖК
│   ├── Building.php                # Модель корпуса
│   ├── Builder.php                 # Модель застройщика
│   ├── BuildingType.php            # Модель технологии строительства
│   ├── Finishing.php               # Модель отделки
│   ├── Location.php                # Модель локации
│   ├── Mortgage.php                # Модель ипотечной программы
│   ├── Region.php                  # Модель региона
│   ├── Room.php                    # Модель комнатности
│   └── Subway.php                  # Модель метро
└── Services/
    ├── FeedService.php             # Сервис для работы с API фида
    └── FilterService.php           # Сервис для фильтрации данных

database/
└── migrations/                     # Миграции базы данных

storage/
└── app/
    └── feeds/                      # Сохраненные ответы API
        └── {region}/
            ├── about.json
            ├── blocks.json
            ├── builders.json
            ├── regions.json
            ├── subways.json
            ├── buildings.json
            ├── apartments.json
            ├── room.json
            ├── finishings.json
            └── buildingtypes.json
```

## Документация

Подробная документация по структуре базы данных и моделям находится в файле [DATABASE_STRUCTURE.md](DATABASE_STRUCTURE.md).

## Важные замечания

1. **Доступ к фидам ограничен по IP** - запросы должны выполняться с сервера, IP которого добавлен в белый список
2. Все доступы выдаются в **пятницу после 15:00 по МСК**
3. Для получения доступа необходимо обратиться к менеджеру из отдела развития
4. Данные в фиде обновляются **раз в неделю - по понедельникам**

## Развертывание на сервере

1. Подключитесь к серверу по SSH:
```bash
ssh root@89.169.39.244
```

2. Перейдите в директорию проекта:
```bash
cd /var/www/ta-feed
```

3. Установите зависимости:
```bash
composer install --no-dev --optimize-autoloader
```

4. Настройте `.env` файл с параметрами базы данных

5. Выполните миграции:
```bash
php artisan migrate --force
```

6. Настройте cron для автоматической загрузки данных (например, каждый понедельник):
```bash
0 16 * * 1 cd /var/www/ta-feed && php artisan feed:fetch msk >> /dev/null 2>&1
```

## Лицензия

Проект создан для внутреннего использования.
