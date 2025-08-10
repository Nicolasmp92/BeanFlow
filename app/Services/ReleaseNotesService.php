<?php

namespace App\Services;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;

class ReleaseNotesService
{
    /**
     * Devuelve el bloque Markdown de la versión indicada desde CHANGELOG.md.
     */
    public function getNotesFor(string $version): string
    {
        return Cache::remember("release_notes:$version", 600, function () use ($version) {
            $path = base_path('CHANGELOG.md');

            if (! File::exists($path)) {
                return "No se encontró CHANGELOG.md";
            }

            $md = File::get($path);

            // Busca desde "## vX.Y.Z" hasta el siguiente "## " o fin de archivo
            $pattern = '/^##\s*v?' . preg_quote($version, '/') . '\b.*?(?=^##\s*v?\d|\z)/ms';

            if (preg_match($pattern, $md, $m)) {
                return trim($m[0]);
            }

            // Fallback: primera sección (por si no taggeaste aún)
            if (preg_match('/^##\s*.+?(?=^##\s|\z)/ms', $md, $m2)) {
                return trim($m2[0]);
            }

            return "No hay notas para la versión $version";
        });
    }
}
