# Следующие шаги после настройки SSH ключей

## 1. На сервере (вы уже подключены) - выполните команды выше

## 2. Отключитесь от сервера
```bash
exit
```

## 3. На локальной машине - проверьте подключение без пароля
```powershell
ssh root@85.198.64.93 "echo 'Подключение без пароля работает!'"
```

Если работает без пароля - отлично!

## 4. Скопируйте архив на сервер
```powershell
scp ta-feed-deploy.tar.gz root@85.198.64.93:/tmp/
```

## 5. Подключитесь к серверу и выполните развертывание
```powershell
ssh root@85.198.64.93
```

На сервере:
```bash
cd /var/www/ta-feed
tar -xzf /tmp/ta-feed-deploy.tar.gz
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
chmod -R 755 storage bootstrap/cache
php artisan migrate --force
```

## 6. Настройте .env файл
```bash
nano /var/www/ta-feed/.env
```

## 7. Выполните тесты
```bash
cd /var/www/ta-feed
php artisan feed:test msk
php artisan feed:fetch msk
php artisan feed:validate
```
