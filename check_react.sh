#!/bin/bash
echo "=== Проверка React приложения ==="
echo ""
echo "1. Проверка файлов сборки:"
ls -lh /var/www/livegrid.ru/public/frontend/assets/
echo ""
echo "2. Проверка manifest:"
cat /var/www/livegrid.ru/public/frontend/.vite/manifest.json
echo ""
echo "3. Проверка доступности через HTTP:"
curl -I https://livegrid.ru/frontend/assets/main-DgRPVjQU.js 2>&1 | head -3
echo ""
echo "4. Проверка HTML страницы:"
curl -s https://livegrid.ru 2>&1 | grep -E 'script.*frontend|link.*frontend|root'
echo ""
echo "5. Проверка содержимого JS файла (первые 200 символов):"
curl -s https://livegrid.ru/frontend/assets/main-DgRPVjQU.js 2>&1 | head -c 200
echo ""
