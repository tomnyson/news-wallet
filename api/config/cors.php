<?php

return [
    'paths' => ['api/*', 'login', '*'], // Allow specific routes or use '*' for all

    'allowed_methods' => ['*'], // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)

    'allowed_origins' => ['*'], // Allow all origins

    'allowed_origins_patterns' => [], // Leave empty for all patterns

    'allowed_headers' => ['*'], // Allow all headers

    'exposed_headers' => [], // Leave empty unless specific headers need to be exposed

    'max_age' => 0, // No caching of preflight responses

    'supports_credentials' => false, // Set to true if you need cookies or Authorization headers
];