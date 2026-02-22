# Быстрая инструкция по переносу на сервер

## Архив создан: ta-feed-deploy.tar.gz (90 KB)

## Шаги для переноса:

### 1. Скопируйте архив на сервер

**Вариант A: Используя WinSCP или FileZilla**
- Подключитесь к: 85.198.64.93 (порт 22, пользователь root, пароль: CJGd6u7u(yA!)
- Скопируйте файл `ta-feed-deploy.tar.gz` в `/tmp/` на сервере

**Вариант B: Используя SCP (если установлен OpenSSH)**
```powershell
scp ta-feed-deploy.tar.gz root@85.198.64.93:/tmp/
```

### 2. Подключитесь к серверу и выполните настройку

```bash
ssh root@85.198.64.93
```

### 3. Выполните команды на сервере:

```bash
# Создайте папку
mkdir -p /var/www/ta-feed
cd /var/www/ta-feed

# Распакуйте архив
tar -xzf /tmp/ta-feed-deploy.tar.gz

# Установите зависимости
composer install --no-dev --optimize-autoloader

# Настройте .env
cp .env.example .env
php artisan key:generate

# Установите права
chmod -R 755 storage bootstrap/cache

# Выполните миграции
php artisan migrate --force

# Удалите архив
rm /tmp/ta-feed-deploy.tar.gz
```

### 4. Отредактируйте .env файл

```bash
nano /var/www/ta-feed/.env
```

Установите настройки базы данных:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ta_feed
DB_USERNAME=root
DB_PASSWORD=ваш_пароль
```

### 5. Выполните тесты

```bash
cd /var/www/ta-feed

# Тест структуры данных
php artisan feed:test msk

# Загрузка данных (если IP в белом списке)
php artisan feed:fetch msk

# Проверка целостности
php artisan feed:validate
```

## Готово!
