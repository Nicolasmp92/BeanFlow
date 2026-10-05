# Protocolo de controles auditables

Leer esta referencia cuando la auditoría incluya lotes bibliográficos, scripts,
PDF, correcciones versionadas o discrepancias entre agentes.

## 1. Gates acumulativos

| Gate | Pregunta | Evidencia mínima | Falla bloqueante |
|---|---|---|---|
| G0 Autorización | ¿Qué puede leerse, ejecutarse y escribirse? | permiso actual y rutas | acción fuera de alcance |
| G1 Disponibilidad | ¿Existen todos los insumos obligatorios? | inventario físico | salida o fuente ausente |
| G2 Identidad | ¿La fuente es la obra declarada? | portada/metadatos/edición | obra o edición distinta |
| G3 Cobertura | ¿El universo está enumerado? | IDs y tramos leídos | cierre con tramos omitidos |
| G4 Esquema | ¿Todos los registros son parseables? | conteo por archivo | cero parseados con contenido |
| G4b Conservación | ¿La corrección preserva identidad y campos no autorizados? | diff por ID/campo/evidencia | ID reasignado o pérdida silenciosa |
| G5 Mecánico | ¿Los controles se ejecutaron correctamente? | banco, comando, salida, exit code | banco falla o ausencia aprobada |
| G6 Literalidad | ¿La cita existe como se declara? | MD/PDF/elisión/localizador | cita fabricada o alterada |
| G7 Conceptual | ¿La cita responde al objetivo y función? | juicio ficha por ficha | selección o paráfrasis inválida |
| G8 Integración | ¿El producto puede entrar a la capa destino? | estados, procedencia, decisión | promoción automática o sin gate |
| G9 Cierre | ¿El informe es reproducible? | denominadores y residuos | prosa no reconciliable |

Los gates no son intercambiables. Pasar G5 no implica G6; pasar G6 no implica G7;
pasar G7 no implica G8.

### Selección por propósito

- Toda auditoría ejecuta G0-G4 y reconstruye denominadores.
- Una corrección versionada añade G4b.
- Una afirmación de literalidad añade G5-G6.
- Una clasificación o paráfrasis añade G7.
- Una integración o promoción añade G8-G9.

No impongas una cantidad fija de niveles. El riesgo y el uso previsto determinan los
gates. Si una falla temprana ya decide el veredicto, documenta el bloqueo y detente,
salvo encargo explícito de auditoría completa.

## 2. Libro de denominadores

Registrar explícitamente:

```text
N_esperado
N_archivos_descubiertos
N_registros_descubiertos
N_registros_parseables
N_controles_ejecutados
N_aprobados
N_pendientes
N_excluidos
N_no_disponibles
```

Invariantes:

- `N_aprobados + N_pendientes + N_excluidos + N_no_disponibles` debe explicar el
  universo pertinente o declarar por qué no lo hace.
- Los IDs, no las menciones textuales, son la unidad de enumeración.
- Una categoría múltiple no puede sumarse como exclusiva.
- Un registro repetido se cuenta una vez y se reporta como duplicado.

## 3. Verificadores

### Antes de ejecutar

1. Leer qué campos reconoce el parser.
2. Comparar ese esquema con una muestra de cada archivo.
3. Ejecutar el banco de pruebas con el mismo umbral del control real.
4. Confirmar que existe una prueba negativa por cada falla crítica.
5. Confirmar que las regresiones reales existen; si faltan, el banco debe fallar.
6. Localizar el documento que fija cada umbral y registrar su valor. Un control con
   otro umbral evalúa un escenario, no el cumplimiento de la regla vigente.

### Durante la ejecución

Registrar:

- comando completo y parámetros;
- denominador esperado y procesado;
- resultados por ID;
- código de salida del proceso principal;
- archivos omitidos y motivo.

No inferir el código de salida después de una tubería: puede corresponder al último
proceso y ocultar la falla del verificador.

### Después

Comparar el denominador procesado con el esperado. Un mensaje “esquema correcto” es
inválido si el parser omitió un archivo completo. Si el script no controla una
dimensión, esa dimensión queda `NO_EVALUADA`, no aprobada.

### Correcciones y vistas derivadas

Al auditar una corrección:

1. comparar la lista de IDs entre base y candidata;
2. verificar que cada ID conserva la misma evidencia o declara el reemplazo;
3. comparar campos obligatorios y estados por registro;
4. tratar tamaño y cantidad de líneas solo como señales de investigación;
5. reconciliar pool, hallazgos, negativos, matrices, informes y vistas derivadas.

Una salida queda bloqueada si el mismo ID representa citas diferentes sin migración
declarada o si dos vistas mantienen valores incompatibles.

## 4. Contraste de citas

### Vía Markdown

Sirve para coincidencia literal barata cuando la extracción conserva el orden. No
sirve por sí sola ante columnas intercaladas, OCR, ligaduras, capitulares, tablas o
saltos de página.

### Vía PDF

Usar extracción y, cuando sea necesario, inspección visual. Registrar página visible,
página interna si difieren, inicio, final y continuidad. La coincidencia de extremos
en una página no basta si los fragmentos son ubicuos o pertenecen a una tabla/índice.

### Elisión

Comprobar:

1. inicio literal;
2. final literal;
3. orden correcto;
4. hueco medido;
5. palabras omitidas declaradas, con tolerancia metodológica explícita;
6. preservación del sentido, que requiere juicio humano.

### Ocurrencia múltiple

Un localizador puede resolverla solo si identifica una ocurrencia real y verificable.
Aceptar cualquier texto en el campo `localizador` convertiría una falla ruidosa en
una aprobación silenciosa.

## 5. Revisión conceptual

Para cada ficha, responder por separado:

| Dimensión | Pregunta |
|---|---|
| Objetivo | ¿La cita responde al objetivo del encargo? |
| Función | ¿Define, caracteriza, distingue, critica, operacionaliza o limita? |
| Paráfrasis | ¿Está implicada por la cita o añade contexto no citado? |
| Procedencia | ¿Es primaria, secundaria o incierta? |
| Pertinencia | ¿Es directa, parcial, nula o pendiente para la pregunta rectora? |
| Estado | ¿Es evidencia, inferencia, negativo, hallazgo o pendiente? |

Una cláusula copulativa no basta para etiquetar `definicion`: “X es un intento de...”
puede definir por propósito, no por contenido. Sustituir el término por `X` ayuda a
detectar la diferencia.

## 6. Modos de fallo documentados

| Código | Falla observada | Guarda |
|---|---|---|
| F1 | Contar coincidencias de una expresión regular como entidades | Enumerar IDs o parsear tablas |
| F2 | Tratar regresión o archivo ausente como aprobado | Ausencia = fallo/NO_DISPONIBLE |
| F3 | Una tubería oculta el código de salida real | Capturar el proceso principal |
| F4 | El parser omite un esquema completo y el informe aprueba | Gate de esquema y denominador |
| F5 | La extracción contradice la página visual | PDF visual decide tipografía |
| F6 | “Localizado” se presenta como “verificado” | Estados separados por vía |
| F7 | Una cita real se etiqueta o interpreta mal | Auditoría conceptual independiente |
| F8 | Un agente audita su propia corrección sin declarar dependencia | Autoauditoría + revisión independiente |
| F9 | IDs únicos dentro de archivos colisionan globalmente | Unicidad en todo el lote |
| F10 | Se usa una norma para justificar algo que no prescribe | Cita normativa y marca proyecto/inferencia |
| F11 | Un informe mezcla acumulado y nueva pasada | Denominadores y alcance por columna |
| F12 | Se cierra un texto con tramos no leídos | Gate de cobertura observable |
| F13 | El control sustituye el umbral vigente por otro | Citar regla y valor junto al comando |
| F14 | Un ID estable se reasigna a otra evidencia | Diff semántico ID-cita entre versiones |
| F15 | Pool, matriz e informe conservan valores incompatibles | Reconciliación entre vistas |

## 7. Adjudicación entre agentes

1. Convertir cada discrepancia en una proposición verificable.
2. Recuperar la fuente y el criterio que pueden decidirla.
3. Reproducir ambos conteos o contrastes.
4. Registrar falsos positivos propios antes de juzgar al otro agente.
5. Si la evidencia decide, adjudicar con ruta y localizador.
6. Si no decide, escalar a la persona responsable con el paquete completo.

Nunca usar “dos agentes coinciden” como sustituto de evidencia.

## 8. Correcciones versionadas

Si el usuario autoriza corregir:

- preservar la salida base;
- crear carpeta/version nueva;
- enumerar cada campo antes/después;
- no cambiar evidencia no incluida en el encargo;
- correr bancos antes y después de modificar verificadores;
- comparar versión nueva con base;
- someter el resultado a revisión independiente.

La corrección no promueve el producto. Solo lo vuelve auditable otra vez.
