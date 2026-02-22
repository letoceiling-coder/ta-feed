# Скрипт для переноса проекта на сервер
$server = "85.198.64.93"
$user = "root"
$password = "CJGd6u7u(yA!"
$remotePath = "/var/www/ta-feed"
$localPath = "."

Write-Host "=== Перенос проекта на сервер $server ===" -ForegroundColor Green

# Проверка доступности сервера
Write-Host "`n1. Проверка доступности сервера..." -ForegroundColor Yellow
$ping = Test-Connection -ComputerName $server -Count 2 -Quiet
if (-not $ping) {
    Write-Host "Ошибка: Сервер недоступен!" -ForegroundColor Red
    exit 1
}
Write-Host "Сервер доступен" -ForegroundColor Green

# Проверка SSH порта
Write-Host "`n2. Проверка SSH порта..." -ForegroundColor Yellow
$sshPort = Test-NetConnection -ComputerName $server -Port 22 -WarningAction SilentlyContinue
if (-not $sshPort.TcpTestSucceeded) {
    Write-Host "Ошибка: SSH порт недоступен!" -ForegroundColor Red
    exit 1
}
Write-Host "SSH порт доступен" -ForegroundColor Green

# Создание архива проекта (исключая vendor, node_modules и другие ненужные папки)
Write-Host "`n3. Создание архива проекта..." -ForegroundColor Yellow
$archiveName = "ta-feed-$(Get-Date -Format 'yyyyMMdd-HHmmss').tar.gz"
$excludeDirs = @("vendor", "node_modules", ".git", "storage/logs", "storage/framework/cache", "storage/framework/sessions", "storage/framework/views", "database/database.sqlite")

# Используем 7zip или tar если доступен
if (Get-Command tar -ErrorAction SilentlyContinue) {
    $excludeArgs = $excludeDirs | ForEach-Object { "--exclude=$_" }
    tar -czf $archiveName $excludeArgs .
    Write-Host "Архив создан: $archiveName" -ForegroundColor Green
} else {
    Write-Host "Предупреждение: tar не найден, будет использован другой метод" -ForegroundColor Yellow
}

Write-Host "`n4. Подключение к серверу и создание папки..." -ForegroundColor Yellow

# Создаем скрипт для выполнения на сервере
$remoteScript = @"
#!/bin/bash
mkdir -p $remotePath
echo "Папка создана: $remotePath"
ls -la /var/www/ | grep ta-feed || echo "Папка не найдена"
"@

# Сохраняем скрипт во временный файл
$tempScript = [System.IO.Path]::GetTempFileName()
$remoteScript | Out-File -FilePath $tempScript -Encoding UTF8

Write-Host "`nДля продолжения выполните вручную:" -ForegroundColor Cyan
Write-Host "1. Подключитесь к серверу: ssh root@$server" -ForegroundColor White
Write-Host "2. Создайте папку: mkdir -p $remotePath" -ForegroundColor White
Write-Host "3. Скопируйте проект используя scp или rsync" -ForegroundColor White
Write-Host "`nИли используйте WinSCP/FileZilla для графического копирования" -ForegroundColor Cyan

# Удаляем временный файл
Remove-Item $tempScript -ErrorAction SilentlyContinue

Write-Host "`n=== Готово ===" -ForegroundColor Green
