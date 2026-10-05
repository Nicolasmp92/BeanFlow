---
tipo: regla
estado: vigente
creado: 2026-10-01
tags: [promocion, entornos, produccion, seguridad-operacional]
---

# Reglas · cadena de promoción lab → dev → producción

> Decisión del 2026-10-01, adoptando el P1 de la auditoría
> `diagnostico_dspace-cris` (EV-06): ninguna operación escribe directo en
> producción. Toda carga/cambio sube por la cadena con verificación en
> cada escalón.

## 1 · La cadena es obligatoria y unidireccional

```
lab (compu trabajo, Docker)   →   cris-dev (TUF, stack nativo)   →   producción (cris)
        │                                │                               │
   ensayo + carga inicial          verificación recreando           solo cuando dev
   de datos/diseño                 el ambiente servidor             demostró funcionar
```

- **Nada se escribe en `repositorio.ohpen.uoh.cl`** (ni ningún host de
  producción) desde un script, import o comando que no haya corrido antes
  completo en lab y verificado en cris-dev.
- Producción es **destino final**, nunca ambiente de prueba ni de iteración.

## 2 · Escrituras seguras por defecto (cierra EV-06)

Todo script que muta un servicio remoto (fotos, relaciones, estructuras,
imports REST) debe cumplir:

- `--dry-run` (solo simulación) como comportamiento **por defecto**;
  escribir exige `--apply` explícito.
- La URL destino se exige explícita o por ambiente (`--env lab|dev|prod`);
  ningún script lleva una URL de producción como default.
- Un allowlist por ambiente rechaza el host de producción salvo flag
  `--prod` adicional.
- Antes de escribir: manifiesto de lo que se va a tocar (IDs, conteos,
  destino) y respaldo/rollback declarado.

## 3 · Verificación en dev antes de subir

Un cambio "pasa a dev" = está desplegado en cris-dev y verificado **a nivel
servidor recreado**, no solo "carga en mi máquina":

- servicios systemd `active + enabled` tras reboot;
- endpoints respondiendo (REST :8080, UI :4000, Apache :80);
- datos/relaciones/facets visibles en la UI;
- rollback ensayado al menos una vez (ej. `structure-builder -x`).

## 4 · Qué viaja y cómo

- **Código**: por git — repo del front sin remoto en nube; bare en cris-dev
  es el canal.
- **Datos**: `scp`/`rsync` controlado + import por procedimientos DSpace —
  nunca reemplazo directo de BD entre ambientes.
- **Datos institucionales sensibles** (ej. fotos de personas): solo con
  autorización explícita; cris-dev trabaja con sintéticos por defecto.

## 5 · Excepción

La única escritura a producción permitida sin haber pasado por la cadena es
una **corrección de incidente urgente**, documentada en bitácora el mismo
día con causa y rollback.
