# Конфигурация деплоя

## Переменные окружения

Добавьте в `.env` файл следующие переменные:

```env
# Deployment configuration
DEPLOY_HOST=root@85.198.64.93
DEPLOY_PATH=/var/www/livegrid.ru
```

## Использование команды

### Базовое использование
```bash
php artisan deploy
```

Команда выполнит:
1. Git commit и push (если есть изменения)
2. Обновление проекта на сервере из git
3. Установку зависимостей (composer + npm)
4. Сборку frontend проекта
5. Выполнение миграций
6. Очистку кеша

### Опции

```bash
# Пропустить git commit/push
php artisan deploy --skip-git

# Пропустить сборку frontend
php artisan deploy --skip-frontend

# Пропустить миграции
php artisan deploy --skip-migrations

# Кастомное сообщение коммита
php artisan deploy --message="Обновление функционала"

# Комбинация опций
php artisan deploy --skip-git --skip-migrations
```

## Что делает команда

1. **Git операции**:
   - Проверяет наличие изменений
   - Добавляет все файлы
   - Создает коммит (с запросом сообщения или использует --message)
   - Отправляет в удаленный репозиторий

2. **Обновление сервера**:
   - Подключается по SSH
   - Выполняет `git pull origin main`

3. **Зависимости**:
   - `composer install --no-dev --optimize-autoloader`
   - `npm install` (если есть папка frontend)

4. **Сборка frontend**:
   - `npm run build` в папке frontend
   - Результат собирается в `public/frontend`

5. **Миграции**:
   - `php artisan migrate --force`

6. **Очистка кеша**:
   - `php artisan config:cache`
   - `php artisan route:cache`
   - `php artisan view:clear`
   - `php artisan cache:clear`

## Отчет

После выполнения команда выводит отчет о проделанной работе:

```
📊 Deployment Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ Git commit & push
   ✅ Server update
   ✅ Dependencies
   ✅ Frontend build
   ✅ Migrations
   ✅ Cache clear
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Deployment completed successfully!
🌐 Project is live and up to date on the server
```
