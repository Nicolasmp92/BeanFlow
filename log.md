# Log — BeanFlow

Bitácora operacional del proyecto. Append-only: una entrada nueva puede
corregir una anterior, pero no borra su huella.

---

## 2025-10-24 — Reemplazo completo: Laravel → Angular + Spring Boot (v2)

- Commit `d2be7a5`: eliminados todos los archivos del stack v1 (Laravel 12 +
  Livewire + Volt). El código del stack nuevo quedó en el working tree
  **sin commitear** — vivió untracked hasta 2026-10-05.
- Estado: confirmado (consolidado en git el 2026-10-05, ver siguiente entrada).

### Decisiones de dominio (registradas)

- **Dominio**: POS de restaurante/café — salón con mesas, comandas,
  cocina, carta con recetas, bodega (insumos + movimientos), cuenta, usuarios.
- **Roles**: `garzon`, `cocina`, `caja`, `admin` (rol simple, como KaiPetPoint).
- **Comanda única por mesa**: índice parcial `uq_comanda_abierta_por_mesa`
  garantiza en BD que una mesa no tenga dos comandas abiertas (concurrencia
  de garzones). **No se enforcea en modo dev H2** (H2 no soporta índices
  parciales — ver `db/migration-h2`).
- **Stock como saldo derivado**: `movimientos_insumo` graba
  `stock_resultante` por fila (firma de auditoría), mismo patrón que KPP.
- **Items de comanda congelados**: `comanda_items` copia `nombre_producto` y
  `precio_unitario` al momento del pedido — cambios en la carta no reescriben
  pedidos históricos.

## 2026-10-05 — Consolidación del stack v2 en git

- Acción: todo el working tree (188 eliminaciones Laravel + stack nuevo
  completo) commiteado y pusheado en `refactor/stack-angular-spring`.
- Stack verificado en vivo: backend Spring Boot 3.5.6 en `:8085`, frontend
  Angular 22 SSR en `:4205`, proxy `/api` → `8085` (`BEANFLOW_API_URL`).
- Fix incluido: `etiquetaRol()` faltaba en `UsuariosPage` (template lo
  referenciaba — la app no compilaba); mapea rol → etiqueta visible.
- **BD pendiente**: PostgreSQL `beanflow`/`beanflow_user` nunca se aprovisionó.
  El backend corre en modo dev con H2 en memoria
  (`BEANFLOW_DB_URL=jdbc:h2:mem:beanflow;DB_CLOSE_DELAY=-1` +
  `SPRING_FLYWAY_LOCATIONS=classpath:db/migration-h2`). Los datos se pierden
  al reiniciar; el índice parcial de comandas no se enforcea en H2.
  Pendiente: `createdb beanflow` + `createuser beanflow_user` con la clave
  de `application.yml` (o vía `.env` con `BEANFLOW_DB_*`).
- Seed: admin `nikolasmp92@gmail.com` / `niko9214` (defaults de
  `application.yml`, override con `BEANFLOW_SEED_*`).

### Fix: 500 en salón/carta/cocina por LazyInitializationException

- Causa: `open-in-view: false` + DTOs armados en el controlador → todo proxy
  lazy (`Comanda.items`, `ComandaItem.comanda.mesa`, `RecetaItem.insumo`,
  `Producto.categoria`, `MovimientoInsumo.insumo`) explotaba al leerse fuera
  de sesión.
- Fix: `@EntityGraph` en los métodos de consulta de los 5 repositorios
  (comandas, comanda_items, receta_items, productos, movimientos_insumo) —
  mismo patrón que el fix `dd4399f` de KaiPetPoint.
- Verificación: `mvn test` verde; smoke curl — 10 endpoints GET en 200 y
  flujo abrir comanda → salón marca mesa ocupada (antes: 500 en mesas y
  carta).
