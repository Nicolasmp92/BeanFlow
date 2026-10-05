---
name: auditoria-evidencia
description: Audita de forma independiente productos de agentes y artefactos de conocimiento mediante identidad de fuentes, denominadores reconstruidos, controles mecánicos, contraste PDF, juicio conceptual y gates de promoción. Usar para revisar productos de agentes, pools de citas, metodologías, dobles auditorías o adjudicaciones; no usar para cosecha primaria ni para inventarios de movimientos del sistema.
---

# Auditoría de evidencia y productos de agentes

## Propósito

Determinar qué parte de un producto derivado está realmente respaldada, qué parte
solo fue declarada y qué decisiones siguen requiriendo juicio humano. La auditoría
no premia coherencia narrativa: reconstruye el resultado desde archivos, registros,
fuentes y controles observables.

Esta skill audita principalmente:

- salidas producidas por uno o más agentes;
- pools de citas, hallazgos, negativos y matrices de cosecha;
- informes metodológicos, glosarios, mapas y diseños de tesauro;
- correcciones versionadas, revisiones cruzadas y adjudicaciones.

## Frontera con otras skills

- Usa `lectura-bibliografica` cuando haya que localizar o contrastar pasajes en el
  corpus. Esta skill gobierna la auditoría independiente y la reconciliación.
- Usa `auditoria_no_destructiva` para movimientos, renombres, snapshots y coherencia
  arquitectónica del sistema. No dupliques ese trabajo aquí.
- Usa `exploracion-analisis` solo si la auditoría deriva en una decisión de diseño o
  cambio de protocolo. La verificación ordinaria sigue este protocolo propio.
- Usa `logica_fable` en máximo rigor cuando el producto sea extenso, contradictorio
  o haya sido producido o corregido por el mismo agente que lo audita.

## Límites y autorización

La autorización para auditar no autoriza corregir, promover ni ejecutar un lote
nuevo. Antes de actuar, declara por separado permisos para:

1. leer productos derivados;
2. abrir fuentes o PDF;
3. ejecutar verificadores y sus bancos;
4. escribir el informe de auditoría;
5. corregir una salida versionada;
6. modificar canon, `.bib`, glosario, tesauro o fuentes.

Si el usuario no autorizó 5 o 6, la auditoría solo informa. Nunca edites la salida
original. Una corrección autorizada crea una versión nueva y preserva la base.

## Invariantes

1. **Verdad en disco antes que prosa.** Enumera registros y parsea tablas; no uses
   conteos narrados como evidencia.
2. **Esperado no es ejecutado.** Mantén separados universo esperado, archivos
   descubiertos, registros parseables, controles ejecutados, aprobados, pendientes y
   excluidos.
3. **Ausencia no es aprobación.** Un insumo ausente, archivo no parseable o control
   omitido bloquea o queda `NO_DISPONIBLE`; jamás suma como éxito.
4. **Los niveles no se sustituyen.** Localización Markdown, literalidad PDF,
   corrección conceptual, citabilidad BibTeX y promoción semántica son pruebas
   distintas.
5. **No decidir por mayoría.** Una discrepancia entre agentes se resuelve contra la
   fuente y el criterio; si la evidencia no decide, permanece abierta.
6. **Un verificador limpio no prueba lo que no mide.** Declara alcance y límites de
   cada script antes de usar su resultado.
7. **Toda auditoría puede fallar.** Incluye autoauditoría, falsación y riesgo residual.

## Flujo operativo

No ejecutes todos los módulos por ritual. `G0-G4` y el libro de denominadores son el
núcleo mínimo. Activa literalidad si el producto hace afirmaciones sobre citas;
activa juicio conceptual si clasifica o interpreta; activa integración si pretende
entrar a glosario, tesauro, canon o producción. Una promoción o adjudicación exige
todos los gates pertinentes. Si un gate temprano ya bloquea el uso previsto, puedes
cerrar allí, salvo que el usuario pida diagnóstico de causa o auditoría completa.

### 1. Preflight y contrato

Recupera reglas, encargo, producto, fuentes, informes previos y controles aplicables.
Define el objeto auditado, la versión, el universo esperado, las afirmaciones que se
comprobarán, las acciones autorizadas y el criterio observable de cierre.

Identifica también el documento que gobierna cada umbral, tolerancia o excepción.
Ejecutar un control con otro valor puede servir como escenario comparativo, pero no
demuestra cumplimiento de la regla vigente.

Si una salida obligatoria no existe, devuelve `NO_DISPONIBLE`; no la reconstruyas.

### 2. R2 e identidad primero

Lee primero los hallazgos de integridad del corpus. Comprueba que cada archivo sea la
obra declarada, que autor/año/edición coincidan y que la extracción sea legible. Un
PDF con nombre correcto puede contener otra obra; un Markdown dañado no invalida por
sí solo el PDF, pero cambia la ruta de verificación.

### 3. Libro de denominadores

Enumera IDs reales y registra como mínimo:

| Magnitud | Valor | Evidencia |
|---|---:|---|
| Esperados | N | encargo/manifiesto |
| Descubiertos | N | archivos y registros físicos |
| Parseables | N | esquema reconocido |
| Ejecutados | N | controles realmente corridos |
| Aprobados | N | pasan el criterio declarado |
| Pendientes | N | requieren otra prueba |
| Excluidos | N | exclusión justificada |

La suma debe reconciliarse por IDs, no solo aritméticamente. Si las categorías son
múltiples, decláralo: no sumes como si fueran exclusivas.

### 4. Controles mecánicos

Ejecuta primero el banco del verificador y después el control real. Conserva comando,
parámetros, denominador procesado, salida relevante y código de salida. No uses una
tubería que oculte el código del proceso principal.

Bloquea si un archivo de pool contiene registros pero el parser reconoce cero, si
faltan regresiones obligatorias o si el denominador procesado no coincide con el
universo. Lee [protocolo-controles.md](references/protocolo-controles.md) para los
gates y modos de fallo probados.

Cuando audites una corrección, compara la versión base con la candidata por IDs,
campos y evidencia. Un ID estable no puede apuntar silenciosamente a otra cita. Una
reducción grande de tamaño es una señal para investigar, no una prueba automática de
regresión. Comprueba además que pool, hallazgos, matrices e informes no conserven
versiones incompatibles del mismo registro.

### 5. Procedencia y literalidad

Para cada cita distingue:

- `LITERAL_VERIFICADA`: pasaje contiguo en la fuente bajo normalización declarada;
- `CORROBORADA_VISUAL`: la página y los extremos confirman el pasaje, pero la
  extracción impide certeza tipográfica completa;
- `ELISION_VERIFICADA`: inicio, final, orden y palabras omitidas comprobados;
- `PENDIENTE_HUMANA`: ninguna vía automática decide;
- `NO_LITERAL`: la ficha reordena, fusiona, añade, omite sin declarar o altera;
- `NO_DISPONIBLE`: la fuente necesaria no está accesible.

Markdown y PDF son vías complementarias. Si una confirma y la otra falla por un
artefacto documentado, no declares falsedad; conserva el estado y la vía que sí
verifica. Si ninguna confirma, prepara un paquete de revisión humana.

### 6. Auditoría conceptual

Solo después de la literalidad evalúa, por ficha:

- si responde al objetivo de cosecha declarado;
- si la función propuesta corresponde al pasaje;
- si la paráfrasis está implicada por la cita o añade contexto externo;
- si la procedencia es primaria, secundaria o incierta;
- si la pertinencia para la pregunta rectora es directa, parcial, nula o pendiente;
- si el registro es evidencia, inferencia, negativo o hallazgo no previsto.

Una cita real puede estar mal elegida o mal clasificada. La auditoría conceptual no
promueve: entrega candidatos y preguntas para ratificación humana. Marca función,
paráfrasis y preservación del sentido como `JUICIO_ANALITICO`, no como comprobaciones
mecánicas.

### 7. Integración y gobernanza

Al auditar glosario, mapa o tesauro, separa:

- `estado_lectura`;
- `estado_verificacion`;
- `estado_semantico`;
- citabilidad bibliográfica;
- pertinencia para la tesis.

No derives relaciones `USE/UP`, `TG/TE` o `TR` de afinidad teórica. Exige procedencia,
reciprocidad y decisión humana. Una regla del proyecto no se presenta como mandato de
ISO/SKOS salvo respaldo literal.

### 8. Reconciliación y adjudicación

Construye una tabla de discrepancias: afirmación, agente, evidencia, prueba, resultado
y estado. Corrige primero tus falsos positivos. Cuando dos agentes discrepen, identifica
la proposición exacta; no compares reputaciones ni cantidad de votos.

### 9. Veredictos separados

Emite un veredicto por objeto auditado:

- `APTO`: todos los gates pertinentes pasan;
- `APTO_CON_OBSERVACIONES`: el núcleo es válido y los residuos están delimitados;
- `BLOQUEADO`: existe una falla que impide el uso previsto;
- `NO_DISPONIBLE`: falta un insumo obligatorio.

No uses un veredicto global para ocultar que un componente está apto y otro bloqueado.
`Apto para trabajo` no equivale a `apto para promoción`.

### 10. Cierre y aprendizaje

Entrega el informe con denominadores, resultados por gate, discrepancias, falsación,
riesgos, decisiones humanas, correcciones recomendadas y lo que no se modificó. Usa
[plantillas.md](references/plantillas.md). Actualiza logs solo si está autorizado.

## Escalamiento humano

Toda ficha que no pueda resolverse debe entregarse a la persona responsable con:

- ID y problema exacto;
- cita completa que debe buscar;
- autor, obra y ruta absoluta de la fuente;
- página, sección o localizador disponible;
- qué debe observar visualmente;
- alternativas y consecuencia de cada decisión.

No pidas al humano “revisar el PDF” sin ese paquete.

## Criterios mínimos de falsación

La auditoría queda falsada o bloqueada si ocurre al menos uno:

- no puede enumerar el universo auditado;
- un parser omite registros sin declararlo;
- un insumo ausente cuenta como aprobado;
- la identidad de una fuente no coincide;
- una cita declarada literal no existe en la fuente;
- el conteo no se reconcilia por IDs;
- el informe confunde localización con verificación o verificación con promoción;
- una corrección no preserva la versión base;
- una relación semántica se adopta sin procedencia o decisión.

## Criterio de logro

La auditoría termina cuando otro agente puede reconstruir, sin confiar en la prosa:
qué se esperaba, qué se encontró, qué se ejecutó, qué pasó, qué falló, qué permanece
incierto, qué evidencia decide cada punto y qué acción sigue. Si eso no es posible,
el estado no puede ser `APTO`.

## Mejora de la skill

Evoluciona esta skill solo desde fallas observadas y fechadas. Aplica una mutación por
vez, conserva la versión base, usa un caso de prueba independiente y declara qué
observación refutaría la mejora. No conviertas cada anomalía local en regla universal.
Un cambio sustantivo pasa por `exploracion-analisis` con exactamente tres ramas y por
ratificación de la persona responsable.

## Contrato operativo

- **Activación:** usar para auditar productos derivados, citas, matrices,
  informes o decisiones que pretendan promoción; no para cosecha primaria.
- **Límite y abstención:** la auditoría no autoriza corregir, promover ni
  ejecutar lotes. Si falta un insumo obligatorio, emitir `NO_DISPONIBLE`.
- **Salida verificable:** entregar denominadores reconciliados, gates por
  objeto, discrepancias, falsación, riesgos y un veredicto separado.
- **Reversión:** la auditoría no edita la fuente original. Si se autoriza una
  corrección, crear una versión nueva y conservar la base para rollback.
