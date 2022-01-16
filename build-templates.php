<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

require_once __DIR__ . '/vendor/autoload.php';

$twigLoader = new FilesystemLoader([__DIR__ . '/src/templates', __DIR__ . '/src']);
$twig = new Environment($twigLoader);

$pageTemplates = scandir(__DIR__ . '/src/templates/pages');

foreach ($pageTemplates as $pageTemplate) {
    if (!str_ends_with($pageTemplate, '.html.twig')) {
        continue;
    }

    [$name] = explode('.', $pageTemplate);

    $html = $twig->render("pages/{$pageTemplate}", []);

    if ($name === 'index') {
        $outputFile = __DIR__ . '/docs/index.html';
    } else {
        if (!is_dir(__DIR__ . "/docs/{$name}")) {
            mkdir(__DIR__ . "/docs/{$name}");
        }
        $outputFile = __DIR__ . "/docs/{$name}/index.html";
    }

    file_put_contents($outputFile, $html);
}