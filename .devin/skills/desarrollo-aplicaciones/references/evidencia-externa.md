# Evidencia externa de `desarrollo-aplicaciones`

Este archivo conserva la procedencia de los criterios anadidos a la skill. No
es una lista de cumplimiento. Cada fuente aporta una idea acotada; ninguna
autoriza declarar que una aplicacion cumple un estandar completo.

## Fuentes normativas o primarias

| Fuente | Evidencia aprovechada | Traduccion en la skill | Limite |
|---|---|---|---|
| [NIST SSDF SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) | La seguridad debe integrarse a cualquier SDLC y ayuda a prevenir vulnerabilidades y recurrencias. | Seguridad presente desde la linea base hasta la entrega, con controles y pruebas por riesgo. | No es una auditoria automatica ni sustituye un modelo de amenazas. |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | Ofrece requisitos tecnicos verificables y recomienda referencias con version porque los identificadores pueden cambiar. | Requisitos de seguridad versionados, estados `no evaluable` y no declarar conformidad completa desde una muestra. | No se copian todos sus controles en una skill general. |
| [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Criterios testables organizados por perceptible, operable, comprensible y robusta. | Accesibilidad como gate con alcance y nivel declarado, combinando pruebas automaticas y humanas. | WCAG cubre contenido web; una app nativa requiere adaptar el criterio. |
| [Reproducible Builds: definicion](https://reproducible-builds.org/docs/definition/) | Misma fuente, entorno e instrucciones deben permitir recrear los artefactos definidos. | Registrar entrada, entorno, instrucciones, artefacto esperado y hash o diferencia explicada. | No toda aplicacion puede ser byte-identica; la variacion debe quedar explicada. |
| [OpenTelemetry: observabilidad](https://opentelemetry.io/docs/concepts/observability-primer/) | Logs, metricas y trazas permiten explicar el estado desde las salidas; la fiabilidad se observa desde lo que espera el usuario. | Contrato minimo de observabilidad y logs con contexto; no imponer una dependencia en apps pequenas. | Instrumentar no demuestra que el comportamiento sea correcto. |
| [GitHub: README](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | README comunica que hace el proyecto, por que sirve, como empezar, ayuda y mantenimiento. | README obligatorio como orientacion actual y con enlaces relativos verificables. | La estructura exacta se adapta al proyecto y al usuario. |
| [Diataxis](https://diataxis.fr/) | Distingue tutorial, how-to, referencia y explicacion segun la necesidad del lector. | No mezclar onboarding, operacion, contrato tecnico y razonamiento en un documento unico. | Es un marco de organizacion documental, no un gate tecnico. |
| [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) | El changelog es una lista curada de cambios notables para personas, no un volcado del git log. | Separar `CHANGELOG.md` de `log.md` y registrar solo cambios de version relevantes. | La convencion no es un estandar formal obligatorio. |
| [Semantic Versioning](https://semver.org/) | Versiones X.Y.Z requieren una API o contrato publico declarado y no deben mutar una vez publicados. | Versionar esquemas, formatos o APIs solo cuando existe un contrato publico; no versionar por decoracion. | Un proyecto interno puede adoptar otra politica explicita. |

## Skills y practicas comunitarias

| Fuente | Observacion | Adopcion |
|---|---|---|
| [jwilger/agent-skills](https://github.com/jwilger/agent-skills) | Agrupa TDD, modelado de dominio, ADR, revision y flujos de equipo; separa plan humano, construccion y revision. | Se adopta la separacion de decisiones, construccion y revision como patron opcional; no se impone un equipo de agentes. |
| [hypothesis-debugging-skills](https://github.com/HermeticOrmus/hypothesis-debugging-skills) | Su paso central es reproducir, aislar, ordenar hipotesis, probar, corregir y documentar. | Se incorpora como modo de depuracion dentro de la etapa 4/5; una hipotesis no se trata como causa confirmada. |
| [OpenAI skill-creator](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/skill-creator) | Skill portable como carpeta con `SKILL.md`, recursos opcionales y validacion mecanica; recomienda mantener la entrada concisa y usar referencias solo cuando aportan. | La skill permanece autocontenida, con esta ficha de procedencia separada y validacion `quick_validate`. |

## Relacion con evidencia local

- La ausencia de README y de una ruta de mantenimiento ya fue tratada en un
  entorno anfitrión como hueco que debe convertirse en pregunta y artefacto
  orientador.
- La divergencia entre vista previa y salida PPTX justifica exigir consistencia
  entre interfaz, modelo y artefacto final.
- Los controles negativos de SEAM justifican que una prueba de calidad incluya
  el caso que debe fallar, no solo el flujo normal.
- La jaula de agentes auxiliares y la regla cero justifican separar lectura,
  propuesta, ejecucion y aprobacion.

`[INFERENCIA]` La combinacion es mas robusta que adoptar cualquiera de las
fuentes por separado porque convierte sus ideas en contratos locales, con
alcance, estado y criterios observables.

`[INCERTIDUMBRE]` La eficacia de esta skill para reducir el costo real de
mantenimiento aun requiere aplicaciones repetidas y comparables; una skill mas
completa puede aumentar el costo cognitivo si no se dosifica por nivel.
