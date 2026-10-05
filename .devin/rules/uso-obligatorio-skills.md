---
tipo: regla
estado: vigente
creado: 2026-10-01
tags: [metodologia, skills, gates, evidencia]
---

# Reglas · uso obligatorio de la metodología del paquete

> Decisión del 2026-10-01, tras la auditoría `diagnostico_dspace-cris`:
> las skills de `.devin/skills/` no son opcionales. El método existe en disco;
> esta regla exige activarlo **antes** de ejecutar el tipo de tarea que gobierna,
> no después ni "de memoria".

## 1 · Activación por gatillo — no opcional

| Si el encargo o la situación es… | Skill obligatoria | Antes de… |
|---|---|---|
| Petición amplia/vaga, sin rutas ni criterio, o primera vez en un sistema desconocido | `triage-entrada` | tocar o analizar cualquier archivo |
| Revisar producto de agente, pool de citas, metodología, auditoría o adjudicación ajenos | `auditoria-evidencia` | emitir juicio o contrainforme |
| Un resultado roto, falla reproducible o número que no cuadra | `diagnostico-fallas` | proponer o aplicar correcciones |
| Crear/migrar/reestructurar una aplicación o revisar su arquitectura | `desarrollo-aplicaciones` | escribir código nuevo |
| Adoptar herramienta, dependencia, patrón o decisión difícil de revertir | `interrogatorio-adopcion` | instalar o comprometer el cambio |
| Tocar archivos compartidos entre máquinas/procesos (logs, bitácoras, docs vigentes) | `guarda-edicion-concurrente` | cualquier edición en ellos |
| Abrir o cerrar sesión con trabajo pendiente en estado persistente | `continuidad-sesion` | retomar o abandonar el trabajo |
| Decisión de diseño sin protocolo específico | `exploracion-analisis` | recomendar una rama |

Si varias aplican, se invocan **todas** al inicio, en paralelo.

## 2 · Prohibiciones del método

- No emitir dictamen, informe ni "está bien" sobre un artefacto sin haberlo
  verificado contra la fuente en disco. Conteo narrado ≠ evidencia.
- No ejecutar escrituras contra sistemas institucionales (CRIS prod, Solr,
  BD, endpoints) sin gate explícito del usuario. Dry-run primero, siempre.
- No declarar una carga/migración/reconciliación "completa" sin manifiesto:
  esperados, procesados, excluidos, hashes.
- No reescribir logs ni bitácoras (ver `logs-y-bitacoras.md`); los estados
  superados se marcan `SUPERADO`, no se borran.

## 3 · Autoverificación

Si en una sesión se ejecutó una tarea que calza con la tabla §1 y no se
invocó la skill, declararlo en el cierre de la sesión (`continuidad-sesion`)
como desviación — no ocultarla.

## 4 · Evolución

Esta regla y las skills se modifican solo vía `exploracion-analisis` con
ramas ToT y ratificación del responsable. Un fallo observado alimenta el
protocolo; no se inventan reglas por una anomalía aislada.
