# Команды для выполнения на сервере

## Вы уже подключены к серверу (root@cerocpvzag)

### 1. Настройка SSH ключей (на сервере)

```bash
# Создайте папку .ssh если её нет
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Скопируйте публичный ключ (выполните на локальной машине, затем вставьте сюда)
# Или выполните на сервере:
nano ~/.ssh/authorized_keys
# Вставьте публичный ключ из локальной машины
# Сохраните (Ctrl+O, Enter, Ctrl+X)

# Установите права
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 2. Создание папки для проекта

```bash
mkdir -p /var/www/ta-feed
cd /var/www/ta-feed
pwd
```

### 3. После копирования архива на сервер

```bash
# Распаковка архива
cd /var/www/ta-feed
tar -xzf /tmp/ta-feed-deploy.tar.gz

# Установка зависимостей
composer install --no-dev --optimize-autoloader

# Настройка .env
cp .env.example .env
php artisan key:generate

# Установка прав
chmod -R 755 storage bootstrap/cache

# Миграции
php artisan migrate --force
```

### 4. Настройка .env файла

```bash
nano /var/www/ta-feed/.env
```

Установите:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ta_feed
DB_USERNAME=root
DB_PASSWORD=ваш_пароль_БД
```

### 5. Выполнение тестов

```bash
cd /var/www/ta-feed

# Тест структуры
php artisan feed:test msk

# Загрузка данных
php artisan feed:fetch msk

# Проверка целостности
php artisan feed:validate
```
