# Настройка React Frontend для LiveGrid

## ✅ Выполненные задачи

### 1. Структура проекта
- ✅ Создана папка `/frontend` для React приложения
- ✅ Настроен Vite для сборки
- ✅ Создан базовый React компонент с React Router

### 2. Laravel интеграция
- ✅ Создан контроллер `SpaController` для обработки всех маршрутов
- ✅ Настроены маршруты в `routes/web.php` для SPA
- ✅ Создан Blade шаблон `spa.blade.php` для загрузки React приложения

### 3. Сборка и развертывание
- ✅ Установлены зависимости npm
- ✅ Настроена сборка в `public/frontend`
- ✅ Настроены права доступа

## 📁 Структура файлов

```
/var/www/livegrid.ru/
├── frontend/              # React приложение
│   ├── src/
│   │   ├── main.jsx       # Точка входа
│   │   ├── App.jsx        # Главный компонент
│   │   └── index.css      # Стили
│   ├── package.json       # Зависимости
│   └── vite.config.js     # Конфигурация Vite
├── app/Http/Controllers/
│   └── SpaController.php  # Контроллер для SPA
├── resources/views/
│   └── spa.blade.php      # Blade шаблон для React
└── public/frontend/       # Собранные файлы (после npm run build)
```

## 🔧 Команды для разработки

### Установка зависимостей
```bash
cd /var/www/livegrid.ru/frontend
npm install
```

### Разработка (с hot reload)
```bash
cd /var/www/livegrid.ru/frontend
npm run dev
```
Приложение будет доступно на `http://localhost:5173`

### Сборка для production
```bash
cd /var/www/livegrid.ru/frontend
npm run build
```
Собранные файлы будут в `public/frontend/`

## 📝 Настройка маршрутов

Все маршруты от корня сайта (`/`) обрабатываются React Router через Laravel:

```php
// routes/web.php
Route::get('/{any}', [SpaController::class, 'index'])->where('any', '.*');
```

Это означает, что все запросы (кроме `/api/*`) будут возвращать React приложение.

## 🚀 API маршруты

API маршруты должны быть определены с префиксом `/api`:

```php
// routes/web.php
Route::prefix('api')->group(function () {
    Route::get('/blocks', [BlockController::class, 'index']);
    // ... другие API маршруты
});
```

## 🔄 Обновление проекта

### После изменений в React коде:
```bash
cd /var/www/livegrid.ru/frontend
npm run build
```

### После изменений в Laravel:
```bash
cd /var/www/livegrid.ru
php artisan route:clear
php artisan config:clear
php artisan view:clear
```

## 📦 Зависимости

### React приложение использует:
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `react-router-dom` ^6.20.0
- `axios` ^1.6.0
- `vite` ^5.0.0
- `@vitejs/plugin-react` ^4.2.0

## ✅ Статус

**Frontend настроен и готов к разработке!**

- ✅ React приложение создано
- ✅ Laravel маршруты настроены для SPA
- ✅ Сборка работает
- ✅ Проект развернут на сервере

## 📝 Следующие шаги

1. Разработать компоненты React
2. Настроить API endpoints в Laravel
3. Интегрировать API с React приложением
4. Добавить стили и UI компоненты
