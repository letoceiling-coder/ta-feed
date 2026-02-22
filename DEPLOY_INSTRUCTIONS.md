# Инструкции по переносу проекта на сервер

## Сервер
- **IP:** 85.198.64.93
- **Пользователь:** root
- **Пароль:** CJGd6u7u(yA!
- **Путь:** /var/www/ta-feed

## Способ 1: Использование WinSCP или FileZilla (рекомендуется)

1. Откройте WinSCP или FileZilla
2. Подключитесь к серверу:
   - Хост: 85.198.64.93
   - Порт: 22
   - Пользователь: root
   - Пароль: CJGd6u7u(yA!
3. Перейдите в `/var/www/`
4. Создайте папку `ta-feed` (если не существует)
5. Скопируйте все файлы проекта из локальной папки `c:\OSPanel\domains\ta-feed\` в `/var/www/ta-feed/`
6. **Исключите при копировании:**
   - `vendor/` (будет установлен через composer)
   - `node_modules/` (если есть)
   - `.git/` (если есть)
   - `storage/logs/*`
   - `storage/framework/cache/*`
   - `storage/framework/sessions/*`
   - `storage/framework/views/*`
   - `database/database.sqlite` (если используется SQLite)

## Способ 2: Использование SCP через командную строку

### Создание архива проекта (на локальной машине)

```powershell
# Перейдите в папку проекта
cd c:\OSPanel\domains\ta-feed

# Создайте архив (используя tar если доступен, или 7zip)
# Исключите ненужные папки
tar -czf ta-feed.tar.gz --exclude=vendor --exclude=node_modules --exclude=.git --exclude=storage/logs --exclude=storage/framework/cache --exclude=storage/framework/sessions --exclude=storage/framework/views --exclude=database/database.sqlite .
```

### Копирование на сервер

```powershell
# Используйте scp (может потребоваться установка OpenSSH для Windows)
scp ta-feed.tar.gz root@85.198.64.93:/tmp/
```

### Распаковка на сервере

```bash
# Подключитесь к серверу
ssh root@85.198.64.93

# Создайте папку
mkdir -p /var/www/ta-feed

# Распакуйте архив
cd /var/www/ta-feed
tar -xzf /tmp/ta-feed.tar.gz

# Удалите архив
rm /tmp/ta-feed.tar.gz
```

## Способ 3: Использование rsync (если установлен)

```bash
rsync -avz --exclude 'vendor' --exclude 'node_modules' --exclude '.git' --exclude 'storage/logs' --exclude 'storage/framework/cache' --exclude 'storage/framework/sessions' --exclude 'storage/framework/views' --exclude 'database/database.sqlite' ./ root@85.198.64.93:/var/www/ta-feed/
```

## После переноса на сервере

### 1. Установите зависимости

```bash
cd /var/www/ta-feed
composer install --no-dev --optimize-autoloader
```

### 2. Настройте .env файл

```bash
cp .env.example .env
php artisan key:generate
```

Отредактируйте `.env` файл с настройками базы данных:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ta_feed
DB_USERNAME=root
DB_PASSWORD=ваш_пароль
```

### 3. Выполните миграции

```bash
php artisan migrate --force
```

### 4. Установите права доступа

```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 5. Выполните тесты

```bash
# Тестирование структуры данных
php artisan feed:test msk

# Загрузка данных (если IP добавлен в белый список)
php artisan feed:fetch msk

# Проверка целостности
php artisan feed:validate
```

## Проверка подключения

Перед переносом проверьте подключение:

```powershell
# Проверка ping
ping 85.198.64.93

# Проверка SSH порта
Test-NetConnection -ComputerName 85.198.64.93 -Port 22
```

## Важные замечания

1. **Безопасность:** После переноса измените пароль на сервере
2. **База данных:** Убедитесь, что MySQL/MariaDB установлен и настроен
3. **PHP:** Убедитесь, что PHP 8.1+ установлен
4. **Composer:** Убедитесь, что Composer установлен
5. **Права доступа:** Настройте правильные права для папок storage и bootstrap/cache
