<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Sanity Check</h1>";
echo "<p>PHP is working.</p>";

// Check Laravel Logic manually
echo "<h2>Checking Paths</h2>";
$autoloader = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    echo "<p>✅ Autoloader found at: $autoloader</p>";
} else {
    echo "<p>❌ Autoloader MISSING at: $autoloader</p>";
}

// Check Environment Variables
echo "<h2>Checking Environment</h2>";
$key = getenv('APP_KEY');
if ($key) {
    echo "<p>✅ APP_KEY is set (Length: " . strlen($key) . ")</p>";
} else {
    echo "<p>❌ APP_KEY is NOT set in getenv()</p>";
    echo "<p>Checking \$_ENV['APP_KEY']...</p>";
    if (isset($_ENV['APP_KEY'])) {
        echo "<p>✅ Found in \$_ENV (Length: " . strlen($_ENV['APP_KEY']) . ")</p>";
    } else {
        echo "<p>❌ Not found in \$_ENV either.</p>";
    }
}


// Check Frontend File
$frontend = __DIR__ . '/app/index.html';
if (file_exists($frontend)) {
    echo "<p>✅ Frontend found at: $frontend</p>";
} else {
    echo "<p>❌ Frontend MISSING at: $frontend</p>";
    echo "<p>Contents of current dir:</p><pre>";
    print_r(scandir(__DIR__));
    echo "</pre>";
    if (is_dir(__DIR__ . '/app')) {
        echo "<p>Contents of app dir:</p><pre>";
        print_r(scandir(__DIR__ . '/app'));
        echo "</pre>";
    }
}
