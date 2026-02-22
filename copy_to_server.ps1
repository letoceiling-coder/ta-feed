# Скрипт для копирования проекта на сервер
$server = "85.198.64.93"
$user = "root"
$password = "CJGd6u7u(yA!"
$archiveFile = "ta-feed-deploy.tar.gz"
$remotePath = "/var/www/ta-feed"

Write-Host "=== Копирование проекта на сервер ===" -ForegroundColor Green

# Проверка наличия архива
if (-not (Test-Path $archiveFile)) {
    Write-Host "Ошибка: Архив $archiveFile не найден!" -ForegroundColor Red
    Write-Host "Сначала создайте архив используя команду:" -ForegroundColor Yellow
    Write-Host "tar -czf ta-feed-deploy.tar.gz --exclude=vendor --exclude=node_modules --exclude=.git --exclude='storage/logs' --exclude='storage/framework/cache' --exclude='storage/framework/sessions' --exclude='storage/framework/views' --exclude='database/database.sqlite' --exclude='*.tar.gz' --exclude='*.zip' ." -ForegroundColor Cyan
    exit 1
}

$fileSize = (Get-Item $archiveFile).Length / 1MB
Write-Host "Размер архива: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow

Write-Host "`nДля копирования на сервер используйте один из методов:" -ForegroundColor Cyan
Write-Host "`n1. WinSCP или FileZilla (рекомендуется):" -ForegroundColor White
Write-Host "   - Подключитесь к $server" -ForegroundColor Gray
Write-Host "   - Скопируйте файл $archiveFile в /tmp/" -ForegroundColor Gray
Write-Host "   - Затем выполните на сервере команды из DEPLOY_INSTRUCTIONS.md" -ForegroundColor Gray

Write-Host "`n2. SCP через командную строку:" -ForegroundColor White
Write-Host "   scp $archiveFile ${user}@${server}:/tmp/" -ForegroundColor Cyan

Write-Host "`n3. После копирования на сервере выполните:" -ForegroundColor White
Write-Host "   ssh ${user}@${server}" -ForegroundColor Cyan
Write-Host "   mkdir -p $remotePath" -ForegroundColor Cyan
Write-Host "   cd $remotePath" -ForegroundColor Cyan
Write-Host "   tar -xzf /tmp/$archiveFile" -ForegroundColor Cyan
Write-Host "   composer install --no-dev --optimize-autoloader" -ForegroundColor Cyan
Write-Host "   php artisan migrate --force" -ForegroundColor Cyan

Write-Host ""
Write-Host "=== Инструкции готовы ===" -ForegroundColor Green
