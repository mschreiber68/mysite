<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

require_once __DIR__ . '/vendor/autoload.php';

$rii = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(__DIR__ . '/src/templates/pages')
);

$names = [];
foreach ($rii as $file) {
    if ($file->isDir()) {
        continue;
    }

    $matches = [];
    preg_match('/\/src\/templates\/pages\/(.+)\.html\.twig$/', $file->getPathname(), $matches);
    if ($matches) {
        $names[] = $matches[1];
    }
}

$twigLoader = new FilesystemLoader([__DIR__ . '/src/templates', __DIR__ . '/build']);
$twig = new Environment($twigLoader);

foreach ($names as $name) {
    $html = $twig->render("pages/{$name}.html.twig", []);

    if ($name === 'index') {
        $outputFile = __DIR__ . '/docs/index.html';
    } else {
        if (!is_dir(__DIR__ . "/docs/{$name}")) {
            mkdir(__DIR__ . "/docs/{$name}", 0777, true);
        }
        $outputFile = __DIR__ . "/docs/{$name}/index.html";
    }

    file_put_contents($outputFile, $html);
}