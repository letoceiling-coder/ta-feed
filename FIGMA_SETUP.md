# Настройка связи с Figma

## 1. Токен Figma

1. Откройте [Figma → Settings → Account](https://www.figma.com/settings) (или Figma → Help → Account settings).
2. В разделе **Personal access tokens** создайте новый токен (или используйте существующий).
3. Скопируйте значение токена (оно показывается один раз).

## 2. Переменные в .env (Laravel)

В корне проекта в файле `.env` добавьте или проверьте:

```env
FIGMA_TOKEN=ваш_токен_из_шага_1
FIGMA_FILE_KEY=CRzpnYXL4h8ud0LXsAclqG
```

- **FIGMA_TOKEN** — персональный токен доступа Figma.
- **FIGMA_FILE_KEY** — ключ файла из URL дизайна:  
  `https://www.figma.com/design/CRzpnYXL4h8ud0LXsAclqG/...` → ключ: `CRzpnYXL4h8ud0LXsAclqG`.

Файл дизайна должен быть доступен аккаунту, к которому привязан токен (вы владелец или имеете доступ).

## 3. Проверка связи из Laravel

Из корня проекта выполните:

```bash
php artisan config:clear
php artisan figma:check
```

Ожидаемый вывод при успехе:

- `OK. File: <имя файла>`
- `OK. Node name: ... , children: ...`
- `Figma connection is OK. You can run: php artisan figma:export-icons`

При ошибке команда выведет сообщение (например, 401 — неверный токен, 403 — нет доступа к файлу).

## 4. Экспорт иконок в проект

После успешной проверки:

```bash
php artisan figma:export-icons
```

Опции:

- `--format=png` или `--format=svg`
- `--scale=2` (1–4)
- `--ids=4-14,4-15,...` — явный список node ID при необходимости

Иконки сохраняются в `frontend/src/assets/livegrid/`.

## 5. API (прокси через Laravel)

Запросы к Figma идут только с бэкенда. Примеры:

```bash
# Информация о файле
curl -s http://127.0.0.1:8000/api/figma/file

# Узлы (например, секция 4-13)
curl -s "http://127.0.0.1:8000/api/figma/nodes?ids=4-13"
```

Токен в этих запросах не передаётся — он только в `.env` на сервере.

## 6. Cursor + Figma MCP (опционально)

Чтобы ассистент в Cursor мог читать Figma (фреймы, экспорт ассетов), настраивается MCP-сервер Figma:

1. В Cursor: **Settings → MCP** (или конфиг MCP в проекте/пользовательском конфиге).
2. Добавьте сервер Figma (Framelink MCP for Figma или аналог).
3. Укажите **Figma Access Token** (тот же персональный токен из шага 1).
4. После сохранения можно запрашивать данные по файлу и node-id (например, 4-13).

Токен для MCP храните только в настройках Cursor/конфиге MCP, не коммитьте его в репозиторий.

## Ошибка SSL (cURL 60) на Windows

Если при запуске `php artisan figma:check` появляется ошибка про SSL certificate:

- На сервере (Linux) запросы к Figma обычно проходят без доп. настройки.
- Локально на Windows: скачайте [cacert.pem](https://curl.se/ca/cacert.pem), в `php.ini` укажите `curl.cainfo = путь/cacert.pem` (и при необходимости `openssl.cafile`), перезапустите PHP.

## Срок действия токена

Текущий токен истекает **24 мая 2026**. До этой даты создайте новый в Figma и замените `FIGMA_TOKEN` в `.env`.

## Замена токена

Если токен сменился или скомпрометирован:

1. Создайте новый токен в Figma.
2. В `.env` замените значение `FIGMA_TOKEN=...` на новое.
3. Выполните `php artisan config:clear` (и при необходимости перезапустите воркеры/очереди).
4. Код менять не нужно — токен читается только из `config('services.figma.token')`.
