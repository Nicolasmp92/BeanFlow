---
tipo: regla
estado: vigente
creado: 2026-09-25
tags: [logs, bitacora, trazabilidad, convencion]
---

# Reglas de logs y bitácoras

Evita la proliferación de logs solapados (caso real: `log.md` + `log-coordinador.md`
en raíz registrando los mismos eventos; `log.md` vs `log-maestro-*` en
CARGAR_DSPACE divergiendo).

## 1. Un solo log narrativo por nivel — nombre exacto `log.md`

- **Raíz del repo** (`log.md`): solo hechos **transversales** — reorganización
  del repo, reglas nuevas, decisiones que afectan más de una línea.
- **Cada línea** (`<LINEA>/log.md`): hechos, decisiones y riesgos de esa línea.
- **Prohibido** crear logs alternos: `log-*`, `*-log.md`, `log_maestro`,
  `bitacora-personal`, logs por sesión o por máquina. Si ya existe un `log.md`
  en ese nivel, ese ES el log.

## 2. Criterio de ubicación antes de escribir

1. ¿El hecho pertenece a una línea? → `<LINEA>/log.md`. No se duplica en raíz.
2. ¿Afecta la estructura del repo o >1 línea? → `log.md` raíz.
3. ¿Es un incidente/riesgo? → **bitácora**, no log narrativo:
   - aplicación → `<LINEA>/docs/bitacora-*.md`
   - host/infraestructura → `SERVIDORES/<host>/bitacora.md`
4. ¿Es una sesión de trabajo con insumo/resultado/reversibilidad? →
   `registro_actividades.md` (tabla, complemento del log — no lo sustituye).

## 3. Append-only

Nunca reescribir entradas pasadas. Si una entrada queda superada se marca
(`SUPERADO <fecha>`), no se borra. Los snapshots van a `versiones/` con fecha
en el nombre.

## 4. Concurrencia (dos PCs + agentes)

Antes de escribir en un log compartido: `git pull`, releer el final del
archivo, añadir al final. Nunca "reordenar" entradas ajenas.

## 5. Cierre de ciclo

Todo commit que cambie una decisión, estado o estructura debe tener su entrada
en el log correspondiente — el commit y la entrada son el mismo acto.

## Estado tras la unificación 2026-09-25

| Log | Rol |
|---|---|
| `log.md` (raíz) | Transversal del workspace |
| `DSPACE-CRIS/log.md` | Línea CRIS |
| `DSPACE-CRIS/registro_actividades.md` | Tabla de sesiones CRIS |
| `DSPACE/log.md`, `DSPACE/CARGAR_DSPACE/log.md` | Línea DSpace 6 (congelada) |
| `DATAVERSE/log.md` | Línea Dataverse |
| `DSPACE-CRIS/docs/bitacora-servidor-cris.md` | Incidentes app CRIS |
| `DSPACE/docs/bitacora-repositorio.md` | Incidentes DSpace 6 |
| `SERVIDORES/<host>/bitacora.md` | Incidentes de host |
| `log-coordinador.md` | **CERRADO** — historial solamente |
| `DSPACE/CARGAR_DSPACE/versiones/log-maestro-*` | Historial archivado |
