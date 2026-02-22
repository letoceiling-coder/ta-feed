# Скрипт для копирования SSH ключа на сервер
$server = "85.198.64.93"
$user = "root"
$pubKey = Get-Content "$env:USERPROFILE\.ssh\id_rsa.pub"

Write-Host "=== Копирование SSH ключа на сервер ===" -ForegroundColor Green
Write-Host ""
Write-Host "Публичный ключ:" -ForegroundColor Yellow
Write-Host $pubKey -ForegroundColor Gray
Write-Host ""
Write-Host "Выполните на сервере (вы уже подключены):" -ForegroundColor Cyan
Write-Host ""
Write-Host "echo '$pubKey' >> ~/.ssh/authorized_keys" -ForegroundColor White
Write-Host "chmod 600 ~/.ssh/authorized_keys" -ForegroundColor White
Write-Host "chmod 700 ~/.ssh" -ForegroundColor White
Write-Host ""
Write-Host "Или выполните эту команду на локальной машине:" -ForegroundColor Cyan
Write-Host ""
Write-Host "type `$env:USERPROFILE\.ssh\id_rsa.pub | ssh root@85.198.64.93 `"cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys`"" -ForegroundColor White
