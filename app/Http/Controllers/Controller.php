<?php
// app/Http/Controllers/Controller.php
// ✏️ Explicación:
// - Namespace: ubica la clase dentro de App\Http\Controllers.
// - Usos: trae traits de autorización/validación y la clase base de routing.
// - class Controller: clase abstracta base que TODOS tus controladores extienden.

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;  // ✅ Trait para policies/autorización
use Illuminate\Foundation\Validation\ValidatesRequests;    // ✅ Trait para validar requests
use Illuminate\Routing\Controller as BaseController;       // ✅ Controlador base del framework

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests; // ✅ Agrega métodos a tus controladores hijos
}
