# Registro de actividades — BeanFlow

| Fecha | Actividad | Evidencia |
|---|---|---|
| 2025-10-24 | Reemplazo Laravel→Angular+Spring: archivos v1 eliminados; stack v2 quedó untracked | `d2be7a5` |
| 2025-10→2026-10 | Stack v2 desarrollado sin commits: auth JWT+cookie, usuarios, mesas, comandas, cocina, carta+recetas, insumos+movimientos, dashboard, perfil; diálogos modales + toasts ya portados | árbol en disco |
| 2026-10-05 | Fix `etiquetaRol()` en UsuariosPage (app no compilaba) | build dev verde |
| 2026-10-05 | Modo dev H2: `db/migration-h2` sin índice parcial + vars `BEANFLOW_DB_*`/`SPRING_FLYWAY_LOCATIONS` | backend :8085 up, login 200 |
| 2026-10-05 | Stack v2 consolidado en git y pusheado (`refactor/stack-angular-spring`) | push a origin |
| 2026-10-05 | Fix 500 salón/carta/cocina: `@EntityGraph` en 5 repos (lazy + open-in-view=false) | mvn test verde; 10 GET 200 + abrir comanda 201 |
| 2026-10-06 | Fix `/cuenta/:id` en blanco: `withComponentInputBinding()` faltaba en `provideRouter` — el `:id` nunca llegaba al `input.required` de CuentaPage | rebuild dev verde; navegación salón→cuenta |
