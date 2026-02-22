<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'LiveGrid') }}</title>
</head>
<body>
    <div id="root"></div>
    
    @php
        $manifestPath = public_path('frontend/.vite/manifest.json');
        if (file_exists($manifestPath)) {
            $manifest = json_decode(file_get_contents($manifestPath), true);
            $entry = $manifest['index.html'] ?? null;
            if ($entry) {
                $js = $entry['file'] ?? null;
                $css = $entry['css'][0] ?? null;
            }
        }
    @endphp
    
    @if(isset($css))
        <link rel="stylesheet" href="{{ asset('frontend/' . $css) }}">
    @endif
    
    @if(isset($js))
        <script type="module" src="{{ asset('frontend/' . $js) }}"></script>
    @endif
</body>
</html>
