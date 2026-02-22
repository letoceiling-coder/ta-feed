<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'LiveGrid') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <!-- Load React App from frontend build -->
    @php
        $manifestPath = public_path('frontend/.vite/manifest.json');
        $mainJs = null;
        $mainCss = null;
        
        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            // Try different possible entry points
            $mainEntry = $manifest['index.html'] ?? $manifest['src/main.tsx'] ?? $manifest['src/main.jsx'] ?? null;
            if ($mainEntry) {
                $mainJs = $mainEntry['file'] ?? null;
                $mainCss = $mainEntry['css'][0] ?? null;
            }
        }
    @endphp
    @if ($mainCss)
        <link rel="stylesheet" href="{{ asset('frontend/' . $mainCss) }}">
    @endif
    @if ($mainJs)
        <script type="module" src="{{ asset('frontend/' . $mainJs) }}"></script>
    @else
        <!-- Fallback: try to find latest build -->
        @php
            $assetsDir = public_path('frontend/assets');
            if (is_dir($assetsDir)) {
                $files = glob($assetsDir . '/index-*.js');
                if (empty($files)) {
                    $files = glob($assetsDir . '/main-*.js');
                }
                if (!empty($files)) {
                    $mainJs = 'assets/' . basename($files[0]);
                }
            }
        @endphp
        @if ($mainJs)
            <script type="module" src="{{ asset('frontend/' . $mainJs) }}"></script>
        @else
            <script>
                console.error('React app not found. Please run: cd frontend && npm run build');
            </script>
        @endif
    @endif
</body>
</html>
