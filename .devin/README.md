# Skills esenciales para programacion

Paquete portable construido desde las fuentes canonicas de
`system_4/skills_compartidas/skills/` el 2026-09-22.

## Contenido

| Skill | Funcion en el ciclo de desarrollo |
|---|---|
| `triage-entrada` | Convierte un encargo amplio en trabajo acotado, presupuestado y verificable. |
| `exploracion-analisis` | Evalua decisiones con primeros principios, OODA, ToT, consejo de cinco y GEPA. |
| `desarrollo-aplicaciones` | Gobierna diseno, implementacion y validacion de aplicaciones mantenibles y portables. |
| `interrogatorio-adopcion` | Evalua dependencias, herramientas y patrones antes de incorporarlos. |
| `guarda-edicion-concurrente` | Evita que agentes o sesiones sobrescriban cambios concurrentes. |
| `continuidad-sesion` | Permite retomar trabajo desde el estado verificable del disco. |
| `diagnostico-fallas` | Reproduce, minimiza, diagnostica y corrige fallas de forma acotada. |
| `auditoria-evidencia` | Audita resultados, fuentes, controles y gates antes de promoverlos. |

## Criterio de seleccion

El paquete cubre el ciclo minimo: acotar, decidir, desarrollar, adoptar,
coordinar, retomar, depurar y auditar. Se excluyen perfiles de autor,
investigacion bibliografica, administracion de skills y adaptadores exclusivos
de un sistema porque no son indispensables para programar.

## Integridad

`MANIFEST.sha256` contiene el SHA-256 de cada archivo incluido. Las carpetas de
skills deben instalarse completas: copiar solo `SKILL.md` puede omitir recursos
requeridos.

## Uso rapido

1. Descomprime el paquete junto al proyecto o en una ubicacion que el agente
   pueda leer.
2. Entrega al agente esta instruccion:

   ```text
   Lee LAUNCHER.md y ejecuta su bootstrap sobre mi proyecto. Puedes crear o
   actualizar inyector-skill.md dentro del proyecto, pero no reemplaces las
   skills base ni amplíes tus permisos sin mi autorizacion.
   ```

3. En sesiones posteriores basta con pedirle que lea `inyector-skill.md`; ese
   archivo seleccionara las skills necesarias para la tarea y evitara cargar el
   paquete completo cada vez.

`LAUNCHER.md` es autocontenido y portable. `plantilla-inyector-skill.md` define
el formato del derivado local que el agente puede adaptar al trabajo real del
usuario. Las mejoras sustantivas se escriben primero como candidatas, se prueban
y solo reemplazan una base tras aprobacion explicita.
