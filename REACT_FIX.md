# React приложение - Проверка и исправление

## ✅ Текущий статус

React приложение **собрано и подключено**:

1. ✅ Файлы сборки находятся в `public/frontend/assets/`
2. ✅ HTML страница загружает скрипты
3. ✅ Файлы доступны через HTTPS
4. ✅ Права доступа настроены

## 🔍 Диагностика в браузере

Если React не отображается, откройте консоль браузера (F12) и проверьте:

### 1. Загружаются ли файлы?
- Вкладка **Network** → обновите страницу
- Найдите `main-DgRPVjQU.js` и `main-BOrl-zwt.css`
- Статус должен быть `200 OK`

### 2. Есть ли ошибки JavaScript?
- Вкладка **Console**
- Проверьте на наличие красных ошибок
- Типичные ошибки:
  - `Failed to load module` - проблема с путями
  - `Cannot read property` - ошибка в коде
  - `CORS error` - проблема с CORS

### 3. Монтируется ли React?
В консоли выполните:
```javascript
document.getElementById('root')
```
Должен вернуться элемент `<div id="root"></div>`

## 🔧 Быстрое исправление

Если React не работает, выполните на сервере:

```bash
# 1. Пересобрать React
cd /var/www/livegrid.ru/frontend
npm run build

# 2. Очистить кеш Laravel
cd /var/www/livegrid.ru
php artisan view:clear
php artisan config:clear

# 3. Проверить права
chown -R www-data:www-data public/frontend
chmod -R 755 public/frontend

# 4. Перезагрузить nginx
systemctl reload nginx
```

## 📝 Проверка на сервере

```bash
# Проверить файлы
ls -lh /var/www/livegrid.ru/public/frontend/assets/

# Проверить manifest
cat /var/www/livegrid.ru/public/frontend/.vite/manifest.json

# Проверить HTML
curl -s https://livegrid.ru | grep -E 'script|link.*frontend'
```

## ✅ Ожидаемый результат

На странице `https://livegrid.ru/` должно отображаться:
- **Заголовок:** "Добро пожаловать в LiveGrid"
- **Текст:** "Это React приложение интегрированное с Laravel"

Если этого нет, проверьте консоль браузера на наличие ошибок.
