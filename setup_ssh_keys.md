# Настройка SSH ключей для подключения без пароля

## Шаг 1: На локальной машине (PowerShell)

### 1.1. Проверьте наличие SSH ключа
```powershell
Test-Path ~/.ssh/id_rsa.pub
```

### 1.2. Если ключа нет, создайте его
```powershell
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N '""'
```

### 1.3. Скопируйте публичный ключ на сервер
```powershell
type ~/.ssh/id_rsa.pub | ssh root@85.198.64.93 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && chmod 700 ~/.ssh"
```

Введите пароль: CJGd6u7u(yA!

### 1.4. Проверьте подключение без пароля
```powershell
ssh root@85.198.64.93 "echo 'Подключение без пароля работает!'"
```

## Шаг 2: После настройки ключей

Теперь можно выполнять команды без пароля:
```powershell
ssh root@85.198.64.93 "команда"
```
