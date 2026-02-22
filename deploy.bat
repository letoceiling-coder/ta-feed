@echo off
chcp 65001 >nul
echo === Перенос проекта на сервер ===
echo.

echo Архив: ta-feed-deploy.tar.gz
if not exist "ta-feed-deploy.tar.gz" (
    echo Ошибка: Архив не найден!
    pause
    exit /b 1
)

echo.
echo Копирование архива на сервер...
echo Пароль: CJGd6u7u(yA!
echo.

scp -o StrictHostKeyChecking=no ta-feed-deploy.tar.gz root@85.198.64.93:/tmp/

if %errorlevel% equ 0 (
    echo.
    echo Архив скопирован успешно!
    echo.
    echo Подключение к серверу для настройки...
    echo.
    ssh -o StrictHostKeyChecking=no root@85.198.64.93 "mkdir -p /var/www/ta-feed && cd /var/www/ta-feed && tar -xzf /tmp/ta-feed-deploy.tar.gz && echo 'Архив распакован'"
) else (
    echo.
    echo Ошибка при копировании!
    echo Используйте WinSCP или FileZilla для ручного копирования
    echo.
)

pause
