---
description: 'Estándares Front-End — Angular 22 minimalista: Screaming Architecture, Tailwind + CDK headless, Signals, SSR'
trigger: always_on
---

# Estándares Front-End — BeanFlow (v2)

Stack vigente (igual que cabid): Angular 22 (standalone por defecto, signals), TypeScript ~6, RxJS 7.8, SSR con Express 5, Tailwind CSS 4 + `@angular/cdk`, Vitest, Prettier (+plugin tailwind), ESLint (angular-eslint), npm.

# 0. Principio rector: minimalismo medible

- **Cada dependencia justifica su peso o no entra.** Preferir APIs nativas de Angular y CSS moderno sobre librerías. Antes de añadir un paquete nuevo: evaluar tamaño gzip, mantenimiento y si Angular ya lo resuelve.
- Objetivo de bundle: initial < 300 kB comprimido. Si un feature lo supera, lazy-load o renegociar la dependencia.
- Menos reglas, más verificables: lo automatizable (lint, prettier, budgets) manda sobre convenciones de estilo.

# 1. Filosofía y Arquitectura (Screaming Architecture)

- **3 pilares** bajo `src/app/`:
  - `core/`: servicios singleton, interceptores, guards, configuración.
  - `shared/`: componentes UI "Dumb", pipes, directivas, `models/` (ver abajo). Agnóstico al negocio.
  - `features/`: una carpeta por módulo de negocio autónomo.
- **Tipos compartidos vs. de dominio:** los tipos transversales (`User` autenticado, envelope de API, errores HTTP) viven en `shared/models/`. Los tipos de dominio viven en `features/<x>/models.ts`. **PROHIBIDO** `models/` disperso por capa técnica ni duplicar tipos entre features.
- **Lenguaje Ubicuo:** vocabulario del negocio en nombres. Evita `data`, `item`, `obj`, `process`; usa `clientProfile`, `billingAddress`.
- **AHA (Avoid Hasty Abstractions):** duplicación leve > abstracción prematura. Extrae a `shared`/`core` cuando el código se repita en 3 lugares.

# 2. Angular Moderno

- **Signals-first:** `signal()`/`computed()` para estado, `input()`/`input.required()`/`output()` para comunicación, `inject()` en propiedades (no constructor), control flow nativo `@if`/`@for` (siempre `track`)/`@switch`/`@empty`/`@defer`.
- **`effect()` con disciplina:** solo para sincronizar con sistemas externos (DOM, logs, storage). **Nunca** para propagar estado entre signals — eso es `computed()`/`linkedSignal()`. Un `effect` que escribe otro signal es un bug en gestación.
- **RxJS donde aporta:** debounce, cancelación, multicasting, HTTP. Convierte a signal en la frontera con `toSignal()` — pero no conviertas streams con lógica temporal compleja: ahí RxJS gana.
- **HTTP:** `provideHttpClient(withFetch())`; data fetching reactivo con `resource`/`httpResource` cuando aplique. Suscripciones manuales solo con `takeUntilDestroyed()`.
- **Rutas:** lazy con `loadComponent`/`loadChildren` por feature.
- **Smart vs Dumb:** `features/` inyecta servicios y maneja estado; `shared/` solo recibe `input()` y emite `output()`.

# 3. Código limpio

- **Early returns:** validar casos inválidos al inicio y `return`. Sin condicionales en forma de flecha.
- **Funciones atómicas:** una responsabilidad por función. Componente > 200 líneas → extraer.
- **TypeScript estricto:** sin `any`; `unknown` + narrowing si no conoces el tipo. Sin casteos para silenciar el compilador.
- Elimina código muerto, comentarios obsoletos e imports sin usar al momento de escribir.

# 4. UI y Estilos — decisión de stack

**Elegido por menor impacto (tráfico, tamaño, tokens): Tailwind CSS 4 como único motor de estilos.**

- CSS utilitario purgado (~10–30 KB en producción), cero JS en runtime, tokens vía `@theme` en `src/styles.css` (archivo `.css` plano — `@import 'tailwindcss'` en `.scss` dispara la deprecación de Sass).
- **Angular Material: NO por defecto.** Su costo (tema completo + JS por componente) no compensa en un proyecto minimalista. Para componentes complejos (menús, dialogs, tooltips, autocomplete) usar **Angular CDK headless** (`Overlay`, `Menu`, `Listbox`, `Dialog`, `A11y`, `BreakpointObserver`) + Tailwind: misma funcionalidad, fracción del peso.
- Excepción: si un componente Material específico ahorra trabajo real (ej. datepicker), evaluar su costo de bundle antes de importarlo y documentar la decisión.
- **`@apply`:** solo en `shared/` con justificación (clase semántica reutilizable). Si un grupo de utilidades se repite, extrae un componente Angular.
- **Tokens de diseño:** custom properties en `:root` referenciadas desde `@theme`. Sin valores mágicos de color/espaciado sueltos.
- **Orden de clases:** `prettier-plugin-tailwindcss` obligatorio — clases desordenadas degradan el HTML rápido.
- **Mobile-first (estrategia obligatoria):** el diseño se plantea primero para móvil y los breakpoints solo **escalan hacia arriba** — nunca se maqueta en desktop y se "achica" después.
  - Las clases sin prefijo son el layout móvil; `sm:`/`md:`/`lg:` solo agregan mejoras progresivas (ej. `flex-col sm:flex-row`, `hidden lg:flex`).
  - Prohibidos los overrides de reducción (`lg:` → base más pequeño, `max-md:` salvo excepción justificada); si aparecen, es señal de que el layout se pensó al revés.
  - Todo elemento táctil ≥ 44×44 px (`h-11`/`w-11`); menús y contenido colapsable cerrados por defecto en móvil (acordeones, no listas expandidas).
  - Verificación: todo cambio visual se revisa a 360 px antes de commitear; sin scroll horizontal ni solapamientos en ninguna página.
  - Anchos de referencia: 360 (móvil) / 768 (tablet) / 1440 (desktop).
- **Accesibilidad:** WCAG 2.2 AA: contraste ≥ 4.5:1, foco visible, teclado completo, `aria-label` en icon-only. Respeta `prefers-reduced-motion`.
- **i18n faseado:** mientras el producto sea solo español, cadenas visibles centralizadas en constantes del feature (migración barata). `ngx-translate` solo cuando exista un segundo idioma real — no antes (YAGNI).
- **SSR seguro:** código browser-only detrás de `isPlatformBrowser(inject(PLATFORM_ID))` o `afterNextRender()`. `@defer` es para performance/lazy rendering, no un guard de plataforma. `TransferState`/`httpResource` para evitar doble fetch.
- **Imágenes:** `NgOptimizedImage` siempre que aplique.

# 5. Workflow y Testing

- **Lint:** `npx ng lint` (angular-eslint flat config ya configurado — incluye reglas de accesibilidad en templates). Todo código debe pasar lint antes de commit.
- **Tests (Vitest):** `.spec.ts` junto al archivo. Bug fix → test de regresión primero. Feature nuevo → spec de componente + servicio.
- **Formato:** `npx prettier --write .` antes de commit (printWidth 100, single quotes, parser angular en `.html`, plugin de Tailwind).
- **Naming:** archivos `kebab-case.ts` (`user-profile.component.ts`), selectores `app-*`, una clase exportada por archivo.
- **Comandos:** `npm start`, `npm run build`, `npm test`, `npx ng lint`. Solo **npm**. Build + lint + tests verdes antes de cerrar una tarea.
- **Commits:** Conventional Commits en español (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `chore:`), pequeños y atómicos. Nunca `node_modules`, `dist`, `.angular`, `.env` ni secrets.
- **Ramas:** una rama por cada cambio, nombrada `<tipo>/<descripcion-corta-kebab>` (ej. `feat/mapa-red`, `fix/favicon`, `refactor/header`). La rama se crea desde `main` (o desde la rama padre si depende de trabajo aún no mergeado) y se mergea vía PR/merge al terminar.
