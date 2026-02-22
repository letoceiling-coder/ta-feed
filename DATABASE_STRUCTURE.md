# Структура базы данных и моделей

## Обзор

База данных предназначена для хранения данных о недвижимости из фида TrendAgent. Система поддерживает работу с несколькими регионами (МСК, СПБ, КРД, НСК, РСТ, КЗН, ЕКБ, КРЫМ).

## Структура таблиц

### Справочники (Reference Tables)

#### 1. `regions` - Регионы/Районы
- `id` (bigint, primary key)
- `name` (string, nullable) - Название региона
- `created_at`, `updated_at` (timestamps)

#### 2. `builders` - Застройщики
- `id` (bigint, primary key)
- `name` (string, nullable) - Название застройщика
- `created_at`, `updated_at` (timestamps)

#### 3. `subways` - Метро
- `id` (bigint, primary key)
- `name` (string, nullable) - Название станции метро
- `created_at`, `updated_at` (timestamps)

#### 4. `rooms` - Комнатность
- `id` (bigint, primary key)
- `name` (string, nullable) - Название (например, "1-комнатная")
- `value` (integer, nullable) - Количество комнат
- `created_at`, `updated_at` (timestamps)

#### 5. `finishings` - Отделка
- `id` (bigint, primary key)
- `name` (string, nullable) - Тип отделки (без отделки/предчистовая/чистовая)
- `created_at`, `updated_at` (timestamps)

#### 6. `building_types` - Технология строительства
- `id` (bigint, primary key)
- `name` (string, nullable) - Название технологии
- `created_at`, `updated_at` (timestamps)

#### 7. `locations` - Локации
- `id` (bigint, primary key)
- `name` (string, nullable) - Название локации
- `created_at`, `updated_at` (timestamps)

#### 8. `mortgages` - Ипотечные программы
- `id` (bigint, primary key)
- `name` (string, nullable) - Название программы
- `created_at`, `updated_at` (timestamps)

### Основные таблицы (Main Tables)

#### 9. `blocks` - Жилые комплексы (ЖК)
- `id` (bigint, primary key)
- `name` (string, nullable) - Название ЖК
- `builder_id` (bigint, foreign key -> builders.id) - Застройщик
- `geometry` (text, nullable, JSON) - Геометка ЖК
- `renderer` (text, nullable, JSON) - Рендеры ЖК
- `progress` (text, nullable, JSON) - Ход строительства
- `plan` (text, nullable, JSON) - Генеральный план
- `created_at`, `updated_at` (timestamps)

**Связи:**
- Many-to-Many с `regions` через `block_region`
- Many-to-Many с `locations` через `block_location`
- Many-to-Many с `subways` через `block_subway` (с полями `distance_time`, `distance_type`)

#### 10. `buildings` - Корпуса
- `id` (bigint, primary key)
- `name` (string, nullable) - Название корпуса
- `block_id` (bigint, foreign key -> blocks.id) - ЖК
- `queue` (string, nullable) - Очередь
- `address` (string, nullable) - Адрес
- `deadline` (date, nullable) - Срок сдачи
- `building_type_id` (bigint, foreign key -> building_types.id) - Технология строительства
- `geometry` (text, nullable, JSON) - Геометка корпуса
- `created_at`, `updated_at` (timestamps)

**Связи:**
- Many-to-Many с `mortgages` через `building_mortgage`

#### 11. `apartments` - Квартиры
- `id` (bigint, primary key)
- `building_id` (bigint, foreign key -> buildings.id) - Корпус
- `area_given` (decimal 10,2, nullable) - Приведённая площадь
- `area_total` (decimal 10,2, nullable) - Общая площадь
- `area_rooms_total` (decimal 10,2, nullable) - Жилая площадь
- `finishing_id` (bigint, foreign key -> finishings.id) - Отделка
- `floor` (integer, nullable) - Этаж
- `floors` (integer, nullable) - Этажей в секции
- `number` (string, nullable) - Номер квартиры
- `plan` (text, nullable) - Планировка (URL или JSON)
- `price` (decimal 15,2, nullable) - Цена при 100% оплате
- `price_base` (decimal 15,2, nullable) - Базовая цена
- `room_id` (bigint, foreign key -> rooms.id) - Комнатность
- `created_at`, `updated_at` (timestamps)

### Промежуточные таблицы (Pivot Tables)

#### 12. `block_region` - Связь ЖК и регионов
- `id` (bigint, primary key)
- `block_id` (bigint, foreign key -> blocks.id)
- `region_id` (bigint, foreign key -> regions.id)
- `created_at`, `updated_at` (timestamps)
- Unique constraint: `(block_id, region_id)`

#### 13. `block_location` - Связь ЖК и локаций
- `id` (bigint, primary key)
- `block_id` (bigint, foreign key -> blocks.id)
- `location_id` (bigint, foreign key -> locations.id)
- `created_at`, `updated_at` (timestamps)
- Unique constraint: `(block_id, location_id)`

#### 14. `block_subway` - Связь ЖК и метро
- `id` (bigint, primary key)
- `block_id` (bigint, foreign key -> blocks.id)
- `subway_id` (bigint, foreign key -> subways.id)
- `distance_time` (integer, nullable) - Расстояние в минутах
- `distance_type` (integer, nullable) - Тип расстояния (1 - пешком, 2 - транспортом)
- `created_at`, `updated_at` (timestamps)
- Unique constraint: `(block_id, subway_id)`

#### 15. `building_mortgage` - Связь корпусов и ипотечных программ
- `id` (bigint, primary key)
- `building_id` (bigint, foreign key -> buildings.id)
- `mortgage_id` (bigint, foreign key -> mortgages.id)
- `created_at`, `updated_at` (timestamps)
- Unique constraint: `(building_id, mortgage_id)`

## Модели Eloquent и их отношения

### Block (ЖК)
**Отношения:**
- `belongsTo(Builder::class)` - Застройщик
- `belongsToMany(Region::class)` - Регионы
- `belongsToMany(Location::class)` - Локации
- `belongsToMany(Subway::class)->withPivot('distance_time', 'distance_type')` - Метро
- `hasMany(Building::class)` - Корпуса

### Building (Корпус)
**Отношения:**
- `belongsTo(Block::class)` - ЖК
- `belongsTo(BuildingType::class)` - Технология строительства
- `hasMany(Apartment::class)` - Квартиры
- `belongsToMany(Mortgage::class)` - Ипотечные программы

### Apartment (Квартира)
**Отношения:**
- `belongsTo(Building::class)` - Корпус
- `belongsTo(Finishing::class)` - Отделка
- `belongsTo(Room::class)` - Комнатность

### Builder (Застройщик)
**Отношения:**
- `hasMany(Block::class)` - ЖК

### Region (Регион)
**Отношения:**
- `belongsToMany(Block::class)` - ЖК

### Subway (Метро)
**Отношения:**
- `belongsToMany(Block::class)->withPivot('distance_time', 'distance_type')` - ЖК

### Room (Комнатность)
**Отношения:**
- `hasMany(Apartment::class)` - Квартиры

### Finishing (Отделка)
**Отношения:**
- `hasMany(Apartment::class)` - Квартиры

### BuildingType (Технология строительства)
**Отношения:**
- `hasMany(Building::class)` - Корпуса

### Location (Локация)
**Отношения:**
- `belongsToMany(Block::class)` - ЖК

### Mortgage (Ипотечная программа)
**Отношения:**
- `belongsToMany(Building::class)` - Корпуса

## Доступные данные из фида

### Информация по ЖК и корпусу:
- Застройщик
- Регион
- Рендеры ЖК
- Геометка
- Расстояние до метро (в минутах пешком/на транспорте)
- Адрес
- Очередь
- Срок сдачи
- Технология строительства
- Генплан (картинка)

### Информация по квартире:
- Цена при 100% оплате
- Базовая цена
- Приведенная площадь
- Общая площадь
- Жилая площадь
- Этаж
- Планировка квартиры
- Количество этажей в секции
- Номер квартиры
- Тип комнатности
- Тип отделки (без отделки/предчистовая/чистовая)

### Информация, которой НЕТ в фиде:
- Список банков и ипотечных программ для квартиры и ЖК
- Фотографии отделки
- Поэтажные планы
- Аэропанорамы
- Вид из окна
- Информация, апартаменты ли это
- Динамика изменения цены
- Квартиры по уступке или вторички
- Ход строительства

## Обновление данных

Данные в фиде обновляются **раз в неделю - по понедельникам**.

## Формат фида

Все данные предоставляются в формате **JSON**.

## Ссылки на фиды

- **МСК**: https://dataout.trendagent.ru/msk/about.json
- **СПБ**: https://dataout.trendagent.ru/spb/about.json
- **КРД**: https://dataout.trendagent.ru/krasnodar/about.json
- **НСК**: https://dataout.trendagent.ru/nsk/about.json
- **РСТ**: https://dataout.trendagent.ru/rostov/about.json
- **КЗН**: https://dataout.trendagent.ru/kzn/about.json
- **ЕКБ**: https://dataout.trendagent.ru/ekb/about.json
- **КРЫМ**: https://dataout.trendagent.ru/crimea/about.json

## Использование фильтров

Система предоставляет сервис `FilterService` для фильтрации данных:

### Фильтрация квартир:
- По цене (min/max)
- По площади (min/max)
- По этажу (min/max)
- По комнатности
- По отделке
- По ЖК
- По застройщику
- По региону
- По метро

### Фильтрация ЖК:
- По застройщику
- По региону
- По метро

### Фильтрация корпусов:
- По ЖК
- По технологии строительства

## Команды

### Загрузка данных из фида:
```bash
php artisan feed:fetch {region}
```

Примеры:
```bash
php artisan feed:fetch msk
php artisan feed:fetch spb
```

Команда:
1. Загружает все данные из фида для указанного региона
2. Сохраняет ответы API в файлы в `storage/app/feeds/{region}/`
3. Загружает данные в базу данных

## Важные замечания

1. **Доступ к фидам ограничен по IP** - запросы должны выполняться с сервера, IP которого добавлен в белый список
2. Все доступы выдаются в **пятницу после 15:00 по МСК**
3. Для получения доступа необходимо обратиться к менеджеру из отдела развития
