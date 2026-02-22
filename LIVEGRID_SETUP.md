# Настройка проекта livegrid.ru

## ✅ Выполненные задачи

### 1. Перенос проекта
- ✅ Проект перемещен из `/var/www/ta-feed` в `/var/www/livegrid.ru`
- ✅ Все файлы скопированы с сохранением структуры
- ✅ Установлены правильные права доступа (www-data:www-data, 755/775)

### 2. Настройка веб-сервера (Nginx)
- ✅ Конфигурация nginx уже была настроена для `livegrid.ru`
- ✅ Настроен root: `/var/www/livegrid.ru/public`
- ✅ Настроен PHP-FPM (php8.2-fpm.sock)
- ✅ Настроены правильные location блоки для Laravel

### 3. SSL сертификат (Let's Encrypt)
- ✅ Установлен Let's Encrypt SSL сертификат через certbot
- ✅ Сертификат действителен до: **2026-05-23** (89 дней)
- ✅ Автоматическое обновление настроено
- ✅ HTTP → HTTPS редирект настроен
- ✅ Сертификат установлен для доменов:
  - `livegrid.ru`
  - `www.livegrid.ru`

### 4. Конфигурация Laravel
- ✅ Файл `.env` скопирован и обновлен:
  - `APP_URL=https://livegrid.ru`
  - `APP_ENV=production`
- ✅ Права доступа настроены:
  - `storage/` - 775
  - `bootstrap/cache/` - 775
  - `storage/framework/views/` - создана
  - `resources/views/` - проверена
- ✅ Кеш очищен и пересоздан

### 5. Проверка работы
- ✅ Сайт доступен по HTTPS: `https://livegrid.ru`
- ✅ SSL сертификат работает корректно
- ✅ Laravel приложение отвечает (HTTP 200)
- ✅ Миграции выполнены
- ✅ База данных подключена

## 📋 Технические детали

### Пути
- **Проект:** `/var/www/livegrid.ru`
- **Public:** `/var/www/livegrid.ru/public`
- **SSL сертификат:** `/etc/letsencrypt/live/livegrid.ru/`
- **Nginx config:** `/etc/nginx/sites-available/livegrid.ru`

### Конфигурация Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name livegrid.ru www.livegrid.ru;
    root /var/www/livegrid.ru/public;
    
    ssl_certificate /etc/letsencrypt/live/livegrid.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/livegrid.ru/privkey.pem;
    
    # Laravel routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        # ...
    }
}
```

### SSL Сертификат
- **Тип:** Let's Encrypt (ECDSA)
- **Домены:** livegrid.ru, www.livegrid.ru
- **Срок действия:** до 2026-05-23
- **Автообновление:** настроено через certbot

## 🔧 Команды для управления

### Обновление SSL сертификата
```bash
certbot renew
```

### Перезагрузка Nginx
```bash
systemctl reload nginx
```

### Очистка кеша Laravel
```bash
cd /var/www/livegrid.ru
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Проверка статуса
```bash
systemctl status nginx
certbot certificates
```

## ✅ Статус

**Проект полностью настроен и работает!**

- ✅ Домен привязан: `livegrid.ru`
- ✅ SSL сертификат установлен и работает
- ✅ Laravel приложение запущено
- ✅ База данных подключена
- ✅ Все миграции выполнены

## 📝 Примечания

1. **Автообновление SSL:** Certbot автоматически обновит сертификат перед истечением срока
2. **Резервная копия:** Создана резервная копия проекта в `/tmp/ta-feed-backup.tar.gz`
3. **Старый проект:** Проект в `/var/www/ta-feed` сохранен (можно удалить при необходимости)

## 🔗 Ссылки

- **Сайт:** https://livegrid.ru
- **WWW:** https://www.livegrid.ru (редирект на основной домен)
