# Простое подключение React к Laravel

## Структура

```
/
├── routes/web.php              # Все маршруты → SpaController
├── app/Http/Controllers/
│   └── SpaController.php      # Возвращает view('app')
├── resources/views/
│   └── app.blade.php          # Простой layout с подключением React
└── frontend/                   # React проект
    ├── src/
    │   ├── main.tsx           # Точка входа
    │   ├── App.tsx            # Главный компонент
    │   └── components/        # Все компоненты
    ├── package.json
    └── vite.config.ts         # Сборка в public/frontend
```

## Как это работает

1. **Laravel роут** (`routes/web.php`):
   ```php
   Route::get('/{any?}', [SpaController::class, 'index'])->where('any', '.*');
   ```
   Все запросы идут в `SpaController`.

2. **Контроллер** (`app/Http/Controllers/SpaController.php`):
   ```php
   public function index() {
       return view('app');
   }
   ```
   Возвращает простой layout.

3. **Layout** (`resources/views/app.blade.php`):
   - Читает `manifest.json` из `public/frontend/.vite/manifest.json`
   - Подключает CSS и JS файлы из собранного React проекта
   - Просто и понятно!

4. **React проект** (`frontend/`):
   - Собирается в `public/frontend/`
   - Использует `index.html` как точку входа
   - Все компоненты из `src/components/` работают

## Деплой

```bash
# Локально
git add .
git commit -m "Описание"
git push origin main

# На сервере
cd /var/www/livegrid.ru
git pull origin main
cd frontend && npm install && npm run build
cd .. && php artisan view:clear
```

## Файлы

- `routes/web.php` - все маршруты
- `app/Http/Controllers/SpaController.php` - контроллер
- `resources/views/app.blade.php` - layout
- `frontend/` - React проект

Все просто и понятно!
