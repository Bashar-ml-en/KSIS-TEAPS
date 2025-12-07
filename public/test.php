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

$env = __DIR__ . '/../.env';
if (file_exists($env)) {
    echo "<p>✅ .env found at $env.</p>";
    $content = file_get_contents($env);
    echo "<pre>Content Check:\n";
    // Show keys but hide values for security, mostly
    foreach(explode("\n", $content) as $line) {
        if(strpos($line, '=') !== false) {
            list($k, $v) = explode('=', $line, 2);
            echo "$k = " . (strlen($v) > 5 ? substr($v, 0, 3) . '...' : $v) . "\n";
        }
    }
    echo "</pre>";
} else {
    echo "<p>❌ .env MISSING. Entrypoint script failed to generate it.</p>";
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
