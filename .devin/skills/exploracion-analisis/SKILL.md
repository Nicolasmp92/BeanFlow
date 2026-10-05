---
name: exploracion-analisis
description: Análisis profundo de decisiones y evaluación de propuestas mediante primeros principios, OODA acotado, exactamente tres ramas ToT y consejo de 5 asesores. Incluye un ciclo GEPA de mejora controlada cuando el usuario autoriza evolucionar una skill o protocolo. No la uses para ejecución directa, consultas simples ni donde ya rige un protocolo específico.
---

# Exploración y análisis profundo (primeros principios + OODA recursivo + consejo de 5)

Estado de esta copia: candidata canónica para distribución; la promoción de
cada instalación se decide y registra en el manifiesto del agente receptor.

## 1. Propósito y linaje

Formaliza el método de análisis que este sistema ya probó tres veces con resultado verificado: la optimización de la skill de escritura (2026-07-02: diagnóstico de adherencia por par v1/v2, gate de pre-vuelo, triage, lint), la fundación del plan de arquitectura (2026-07-06: síntesis crítica de 3 prompts externos, fase F0) y la preparación de la presentación Dong (2026-07-02/03: pivote de texto en una noche con extracción verificable). Antes de esta skill, el método se re-derivaba en cada sesión desde prompts ad hoc; eso costaba contexto y producía aplicaciones desiguales. La skill fija la mejor versión conocida y deja definido cómo mejorarla (§8).

Los protocolos de automejora, autorización y regla cero del entorno anfitrión
pueden complementar esta skill. Si no existen, se aplica el contrato interno y
se marca la limitación; nunca se inventa su contenido.

## 2. Cuándo activar y cuándo no

**Activar:**
- Decisiones de diseño o arquitectura del sistema (protocolos, skills, reorganizaciones).
- Evaluación crítica de propuestas externas (prompts, planes y sugerencias de agentes).
- Decisiones de estrategia de tesis o de producto donde el error es caro o difícil de revertir.
- Cuando el usuario invoca el método por nombre (OODA, 5 asesores, primeros principios).

**NO activar:**
- Ejecución directa ya decidida (editar un texto, sincronizar el log, ingestar un archivo).
- Consultas de información al wiki o a fuentes.
- Donde rige protocolo propio: auditoría, escritura en voz o detección IA. Esta
  skill puede envolver esas capacidades cuando el entorno las provee, no
  reemplazarlas.
- Micro-decisiones con default obvio: decidir también cuesta; sobre-analizar lo trivial es el primer modo de fallo (§6).

## 3. Arquitectura del método (cómo se componen las tres piezas)

Las tres herramientas no se apilan: cada una ocupa un lugar preciso del ciclo.

```
OODA (bucle exterior: el proceso completo)
├── OBSERVE   → mirar el estado REAL (disco, evidencia, contexto), no el declarado
├── ORIENT    → motor: PRIMEROS PRINCIPIOS
│               desarmar los supuestos del planteamiento, reconstruir el problema
│               desde cero, responder "¿qué se pregunta de verdad debajo?"
├── DECIDE    → amplificador: CONSEJO DE 5 ASESORES
│               crítica multi-sesgo sobre las opciones que Orient dejó en pie
└── ACT       → ejecutar lo decidido dejando huella (log) y estado consistente
```

**Primeros principios en Orient.** Antes de evaluar opciones, impugnar la pregunta: identificar los supuestos que trae el planteamiento (a menudo la pregunta está mal formulada), explorar qué cambia si son falsos, y re-plantear. Ancla: el objetivo "crecimiento exponencial" del plan de arquitectura se corrigió a "crecimiento gobernado" ANTES de diseñar, y todo el plan cambió con eso.

**Consejo de 5 en Decide.** Cinco roles con compromiso total (sin "por otro lado"):
1. **Contrario:** por qué esto va a fracasar; el punto ciego del usuario; el modo de fallo más probable.
2. **Primeros Principios:** el problema real debajo del planteamiento; corrige la pregunta si está mal hecha.
3. **Expansionista:** el potencial 10x oculto; la oportunidad que nadie está viendo.
4. **Forastero:** sin contexto del dominio; qué resulta raro desde afuera; qué dan por sentado los de adentro.
5. **Ejecutor:** solo el lunes por la mañana; la primera acción concreta; la versión mínima ejecutable esta semana.

Luego: **revisión anónima** (reetiquetar A-E mezcladas; responder: ¿cuál es la más sólida?, ¿cuál tiene el mayor punto ciego?, ¿qué factor omitieron las cinco?) y **presidente** (recomendación definitiva + razón principal + paso inmediato; ≤200 palabras).

**Ramas antes del consejo (generación de opciones, incorporado 2026-08-19).** El
consejo de 5 es un **amplificador de crítica**, no un generador: critica *una*
propuesta desde cinco ángulos. Si esa propuesta es la primera que se le ocurrió al
modelo, los cinco asesores terminan puliendo una opción que nadie eligió, y eso
activa R2 de `logica_fable` (anclaje en el primer ejemplo disponible).

Por eso, en decisiones de diseño, **Decide abre con exactamente tres ramas ToT**:

1. **Rama A — conservar:** no cambiar o aplicar la versión mínima reversible.
2. **Rama B — mutar:** corregir únicamente el fallo observado con el cambio más
   pequeño que pueda probarse.
3. **Rama C — rediseñar:** cambiar la estructura solo si A y B no resuelven el
   problema o si la evidencia muestra un fallo de arquitectura.

No son tres redacciones de la misma opción. Se comparan por ajuste al problema,
costo, reversibilidad, legibilidad y riesgo de regresión. Se documenta una tabla
de tres filas y se pasa al consejo solo la rama o empate que sobreviva. Ancla: en
el caso TM (2026-08-19) la rama ganadora no fue una crítica de la primera opción,
sino una alternativa que el consejo no habría generado por sí solo.

**Cuándo NO enumerar:** si la decisión tiene un default obvio o es reversible
barata, la enumeración es sobre-análisis (F4). Las ramas se justifican cuando el
error es caro o difícil de revertir.

**Loop del ciclo completo (acotado, incorporado 2026-08-19).** La parada por
estabilidad de abajo gobierna la recursión **vertical** (sub-OODA dentro de una
fase). No cubre el caso en que la primera pasada del ciclo completo salga mal:
hasta ahora toda aplicación fue de una sola pasada y nada la controlaba.

Reglas del loop, en este orden de importancia:

1. **Default: una pasada.** El loop no es la norma sino la excepción, y se abre
   solo si al cerrar Act el criterio de salida **no** se cumplió.
2. **Presupuesto duro: máximo 2 pasadas.** Vencido el presupuesto, el análisis
   **se cierra igual** y declara qué quedó sin resolver, con qué evidencia
   faltante. Un análisis abierto indefinidamente es F4 con otro nombre, y la
   restricción maestra del sistema sigue siendo que hay un solo humano con
   deadlines (F5).
3. **La segunda pasada no repite la primera:** entra con lo aprendido y cambia
   algo declarado (el planteamiento tras primeros principios, la evidencia
   recuperada, o las ramas consideradas). Si nada cambia, no es una pasada nueva.

**Condición de falsación (solo en decisiones sustantivas).** Cuando el análisis
produce una decisión que **cambia un protocolo o es cara de revertir**, declara en
una línea **qué observación futura mostraría que fue equivocada**. Convierte el
estado `provisional` de una etiqueta en algo comprobable, y le da al log un
disparador de revisión en vez de una fecha.

No se pide para decisiones reversibles baratas: ahí es burocracia (F4).

**Recursión acotada.** Cada fase del OODA puede abrir un sub-OODA interno cuando su materia lo amerita (p. ej., Orient sobre un corpus complejo). Límites duros: **profundidad máxima 2** (OODA dentro de OODA; nunca un tercer nivel) y **criterio de parada por estabilidad**: se itera hasta que una pasada adicional no agrega ni quita nada sustantivo. Ancla: el prompt de extracción Dong usó "la lista se estabiliza" como parada y funcionó; el despliegue completo sin tope produce ~80 subsecciones por entregable (advertencia del propio material fuente, confirmada).

## 3bis. Pre-OODA y cierre Learn (incorporado 2026-07-06, propuesta externa vía consejo; bitácora 06 §5)

**Antes de Observe (pre-OODA, breve, obligatorio en COMPLETO y CONDENSADO):**
- **Retrieve:** nombrar qué archivos, protocolos, skills, logs o decisiones previas gobiernan la tarea (¿ya existe norma? ¿ya se decidió antes?). Si no se recuperó evidencia, decirlo.
- **Verify:** clasificar los insumos con las marcas epistémicas del entorno,
  incluyendo `[HECHO VERIFICADO]` y `[NO AUTORIZADO]` cuando correspondan.
- **Map Evidence:** en tareas grandes, tabla mínima artefacto · estado · uso permitido. Si la evidencia clave falta, el análisis continúa solo como **propuesta condicionada**, nunca como diagnóstico definitivo.

**Después de Act (Learn, cierre del ciclo):** si el análisis produjo una decisión relevante o un resultado distinto del esperado, dejar el ancla (fecha · decisión · evidencia · resultado esperado vs observado · ajuste) en el banco §6 o en la bitácora que corresponda. Sin Learn, el sistema repite sus análisis en vez de acumularlos.

*Nota de diseño: Retrieve/Verify fijan como fases nombradas la recuperación de
  evidencia y su clasificación antes de razonar. El entorno anfitrión puede
  añadir sus propias fuentes de verdad.*

## 3ter. Composición con `logica_fable` (recíproca, 2026-08-19)

`logica_fable` ya mapea sus regularidades a las fases de este método (su §3bis) y
su protocolo §3 deriva aquí cuando la decisión es sustantiva. La relación era
**asimétrica**: esta skill apenas la mencionaba. Queda declarada en ambos sentidos.

Qué vigilar en cada fase, con la guarda que corresponde:

| Fase | Riesgo dominante | Guarda |
|---|---|---|
| Observe | R3 (la memoria deriva) · R9 (pesa lo reciente, no lo pertinente) | verdad en disco antes de afirmar; recuperar por pertinencia declarada |
| Orient | R2 (anclaje en el primer ejemplo) · R11 (confundir piso estructural con falla corregible) | primeros principios impugna el planteamiento; preguntar si el residuo es piso |
| Decide | R2 otra vez (criticar la primera opción) · R6 (complacencia) | **ramas antes del consejo** (§3); roles al 100 % sin "por otro lado" |
| Act | R5 (sobreproducción) · R7 (rellenar huecos) | sección "qué NO"; marcas epistémicas; creación mínima |
| Learn | R7 (la impresión no es evidencia) | anclas fechadas, con fuerza declarada (n=1 débil / n≥2 fuerte) |

**Regla de fuerza importada de `logica_fable` §6.1:** toda regla nueva de esta
skill declara su fuerza de evidencia. Una aplicación no basta para promover a
`vigente`; se marca `provisional · n=1` y espera el segundo caso.

## 3quater. Contrato de portabilidad

Esta versión puede distribuirse entre agentes con sistemas de archivos y
protocolos distintos.

- El núcleo es autónomo: OODA, primeros principios, tres ramas ToT, consejo,
  GEPA, gates y marcas epistémicas no dependen de una ruta concreta.
- Las referencias a documentos de control, perfiles de runtime, planes de trabajo o
  matrices locales son opcionales. Si no existen en el agente receptor, se
  marca `[INCERTIDUMBRE]` y se continúa con el contrato interno; nunca se
  inventa su contenido.
- No uses rutas absolutas, nombres de usuarios, proveedores ni permisos
  específicos de un sistema en la salida. La capa anfitriona define dónde se
  puede escribir y qué requiere aprobación.
- La instalación copia solo `SKILL.md` y conserva el nombre canónico
  `exploracion-analisis`. Un sistema que ya invoque `exploracion_analisis` puede
  mantener ese alias como compatibilidad, sin duplicar dos versiones activas.
- La distribución no equivale a promoción: cada agente receptor debe ejecutar
  su propio holdout y registrar el resultado antes de activar la skill.

## 4. Dosificación y criterio de salida (declarar ambos al arrancar)

**Antes de analizar, en una línea: qué haría que este análisis esté terminado.**
Incorporado 2026-08-19 porque la skill no lo tenía: el análisis terminaba cuando el
agente decidía que había terminado, sin criterio externo. Formulaciones válidas:

- «termina cuando quede una sola opción en pie y sepamos qué la refutaría»;
- «termina cuando el conteo esté verificado en disco y las cifras cuadren»;
- «termina cuando cada afirmación tenga clave o marcador explícito».

Un criterio de salida es **observable por un tercero**. «Cuando esté bien
analizado» no lo es. Si no se puede formular, la tarea todavía no está definida y
eso es, en sí mismo, el primer hallazgo.



| Nivel | Cuándo | Qué se ejecuta | Qué se documenta |
|---|---|---|---|
| **COMPLETO** | Decisiones de arquitectura/estrategia caras o difíciles de revertir; creación de protocolos y skills | OODA + primeros principios + consejo completo (5 roles + revisión anónima + presidente) | Tabla de veredictos condensada (3-5 viñetas por celda) + presidente + qué NO se adoptó |
| **CONDENSADO** | Diseños medios, evaluación de propuestas, planes de sesión | OODA + primeros principios + consejo en una pasada (los 5 roles opinan, sin etapa anónima formal) | Tabla breve de objeciones/cambios + decisión |
| **RÁPIDO** | Decisiones chicas que igual merecen orden | OODA simple, sin consejo | 2-4 líneas: qué se observó, qué se decidió, por qué |

Regla de oro heredada (decisión de la persona responsable, 2026-07-06): **el método se aplica completo; la documentación va condensada.** La transcripción íntegra del razonamiento no se escribe salvo pedido expreso.

**Escalera de activación del sistema completo** (mapa adoptado de la propuesta externa 06-07, para situar esta skill entre las demás):
`N0` respuesta simple (sin skill) · `N1` verificación mínima (gate de voz, lint, grep de estado) · `N2` = RÁPIDO · `N3` = CONDENSADO (incluye pre-OODA §3bis) · `N4` = COMPLETO · `N5` = COMPLETO + protocolo 06 (cuando el resultado crea o cambia protocolos/skills). No todo requiere consejo; subir de nivel sin necesidad es el modo de fallo F4.

## 5. Reglas duras de anclaje (no negociables)

1. **Verdad en disco sobre verdad declarada:** Observe verifica con las
   herramientas de lectura disponibles, no con memoria ni con lo que el índice
   dice. Orientar sobre un mapa falso invalida todo lo demás.
2. **Regla cero:** el análisis registra datos y scripts por ruta y rol probable;
   no los abre ni interpreta si el entorno anfitrión no autoriza hacerlo.
3. **Marcas epistémicas obligatorias:** `[INFERENCIA]` (juicio desde indicios), `[SUPUESTO]` (premisa sin verificar, declarada), `[INCERTIDUMBRE]` (abierto de verdad, con opciones si las hay). Si falta información, se declara; no se rellena.
4. **Sección "qué NO se adopta" obligatoria** en todo output de nivel COMPLETO o CONDENSADO, con la razón de cada descarte. Ancla: las secciones "NO aplicado" del 02-07 y del plan F0 evitaron tres sobredimensionamientos documentados.
5. **Interrumpibilidad:** el análisis debe poder cortarse en cualquier fase dejando estado consistente (lo observado registrado, lo pendiente nombrado). El sistema tiene un solo humano con deadlines; esa es la restricción maestra.
6. **Reusar antes que inventar:** si el entorno ya gobierna el asunto mediante
   documentos o skills, el análisis referencia y extiende; no re-deriva.

## 6. Modos de fallo conocidos (banco de anclas)

| # | Modo de fallo | Ancla (evidencia fechada) | Guarda |
|---|---|---|---|
| F1 | Explosión combinatoria: desplegar toda la recursión por escrito | 06-07: 5 asesores × OODA por fase = ~80 subsecciones/documento; vetado por decisión de la persona responsable | §4 documentar condensado; §3 profundidad ≤2 |
| F2 | Re-derivar lo que ya existe | 06-07: los 3 prompts externos proponían gobernanza que los documentos de control ya tenían | §5.6; Observe incluye leer la capa de control |
| F3 | Complacencia: la crítica converge al acuerdo si no se fuerzan roles | Sesión completa: la calidad crítica apareció SOLO con roles comprometidos al 100% | Consejo con personajes sin matices; prohibido "por otro lado" dentro de un rol |
| F4 | Sobre-análisis de lo trivial | Patrón general; el análisis también cuesta contexto y tiempo | §2 no activar; nivel RÁPIDO existe para eso |
| F5 | Punto ciego recurrente del consejo: olvidar que hay UN humano con deadlines | 06-07: los 5 asesores lo omitieron; lo aportó la revisión anónima | Pregunta fija en la revisión anónima: ¿qué le cuesta esto a la persona responsable esta semana? |
| F6 | Inferencia vestida de hallazgo | 06-07: prompt Gemini declaraba pipelines "activos" desde nombres de carpeta | §5.3 marcas; regla cero |

| F7 | **Loop abierto: iterar sin presupuesto ni criterio de salida.** El análisis no converge, converge tarde, o se declara terminado por cansancio y no por criterio | 2026-08-19: hasta esa fecha la skill no tenía criterio de salida (0 menciones) y toda aplicación fue de una sola pasada sin control; la parada por estabilidad cubría solo la recursión vertical | §4 criterio de salida observable declarado al arrancar; §3 presupuesto duro de 2 pasadas con cierre forzoso que declara lo no resuelto |
| F8 | **Autoevolución complaciente:** la skill evalúa su propia mutación sin holdout independiente o confunde una mejora local con mejora global | 2026-08-24: se inicia esta autoaplicación; evidencia todavía provisional | §8.0 exige base intacta, tres ramas, holdout negativo, gate y rollback |

*Regla de escisión: si este banco supera ~15 anclas, migra a `references/anclas.md` (patrón voz-cristobal).*

## 7. Formato de salida

- **COMPLETO:** (1) reformulación del problema tras primeros principios (si cambió, decirlo); (2) tabla de veredictos del consejo (asesor · OODA condensado · cambio concreto); (3) revisión anónima en 3 líneas; (4) presidente (≤200 palabras: recomendación + razón + paso de hoy); (5) qué NO se adopta y por qué; (6) marcas epistémicas donde apliquen.
- **CONDENSADO:** tabla breve + decisión + qué NO.
- **RÁPIDO:** párrafo con la decisión y su porqué.
- **En todos los niveles:** el criterio de salida declarado al arrancar y si se
  cumplió; si hubo segunda pasada, qué cambió respecto de la primera; y, en
  decisiones sustantivas, la condición de falsación.
- En todos: si el análisis recomienda actuar sobre capas protegidas (matriz de `01`), el output lo presenta como **propuesta**, nunca como acción tomada.
- En autoevolución: añade la tabla exacta de tres ramas, la mutación aplicada,
  el holdout usado, el resultado por eje de Pareto, el gate y lo que **no** se
  adoptó. No presentes una candidata como versión vigente.

### 7bis. Contrato observable de conformidad

En los niveles COMPLETO y CONDENSADO, la salida debe permitir que otro agente
compruebe la aplicación sin reconstruir el razonamiento interno. Incluye:

1. activación y nivel, con la razón;
2. criterio de salida y si se cumplió;
3. tabla de exactamente tres ramas cuando la decisión sea sustantiva;
4. decisión o empate zonificado, con condición de falsación;
5. qué no se adopta y por qué;
6. marcas epistémicas y evidencia recuperada;
7. si fue GEPA: baseline, candidata, mutación, holdout, ejes Pareto y gate.

Para una instalación nueva, el receptor puede ejecutar un conformance check con
un caso sustantivo, uno trivial y uno de autoevolución. El check registra solo
estados observables (`pass`, `fail`, `no_evaluable`), no exige revelar cadena de
razonamiento y no activa la skill en producción por sí solo.

## 8. Escalamiento de esta skill (instrucciones para seguir mejorándola)

### 8.0 Ciclo GEPA para evolución controlada

Cuando el usuario autorice evolucionar esta skill, aplica un ciclo separado del
análisis ordinario. La skill no se edita a sí misma en producción ni modifica su
fuente protegida: crea una candidata en un espacio de laboratorio y conserva la
base intacta.

1. **Reflexión:** reúne aplicaciones reales, el criterio de salida, el resultado
   esperado y el observado. Cada fallo debe tener ruta, comprobación y estado;
   una impresión no es evidencia.
2. **Frontera de Pareto:** evalúa la base y las tres ramas ToT en al menos estos
   ejes: corrección/seguridad, cobertura o utilidad, costo/eficiencia y
   legibilidad/mantenimiento. Si una mejora gana un eje y pierde otro, no la
   declares superior: zonifica cuándo usar cada versión.
3. **Mutación:** aplica una sola mutación sustantiva por generación, descrita
   como diff y vinculada al fallo que intenta corregir. No acumules reglas
   preventivas sin evidencia.
4. **Holdout:** prueba la candidata con casos no usados para diseñarla y con al
   menos un caso negativo o de abstención. La evaluación debe comprobar el
   comportamiento y no solo la presencia de secciones.
5. **Gate:** conserva la candidata solo si mejora el criterio declarado sin
   regresión crítica. Si hay empate Pareto, conserva perfiles separados. Si
   falla, registra el motivo y vuelve a la base; no sobreescribas la producción.

La autoaplicación tiene profundidad máxima de dos generaciones y presupuesto de
dos pasadas por generación. Se detiene antes si una pasada no agrega cambios
sustantivos o si el criterio de salida no puede medirse. El resultado siempre se
marca `candidata`, `provisional` o `rechazada`; la promoción requiere decisión
humana explícita.

1. **Fuente de mejora:** cada aplicación real cuyo resultado difiera de lo esperado (mejor o peor) añade un ancla al banco §6, con fecha, evidencia y guarda derivada. Sin ancla no hay cambio de regla.
2. **Mejora monótona vs frente de Pareto (incorporado 2026-08-19).** La regla 1
   asume que las mejoras se acumulan: se agrega un ancla, la skill mejora. Hay casos
   donde **no**, porque dos objetivos legítimos compiten y mejorar en uno empeora el
   otro. Antes de adoptar una mejora, clasificarla:

   - **Monótona:** nadie pierde. Se adopta y se promueve con evidencia (regla 1).
   - **Pareto:** hay un intercambio real. Entonces **no se elige ganador ni se
     promedia**; se **zonifica**, declarando en qué condiciones rige cada polo, y se
     deja la tensión escrita en vez de resuelta.

   Ancla: `voz-cristobal` 2026-08-19. El doblete de reformulación (dejar sin resolver
   una elección de palabra) **baja la detección automática y sube la opacidad ante un
   evaluador humano**, con evidencia de los dos jueces sobre el mismo pasaje.
   Cualquier "mejora" que optimizara un eje habría dañado el otro. La resolución fue
   por zona: libre en prosa de desarrollo, prohibido en la frase que define un
   concepto. Una skill que solo sabe mejorar en línea recta no puede representar eso.

   Corolario operativo: cuando una regla nueva contradiga una existente, **la
   contradicción es el dato**, no un error de redacción. Se busca la variable que las
   separa (zona, género, destinatario) antes de derogar cualquiera de las dos.

3. **Cambios sustantivos** (añadir/quitar un rol del consejo, cambiar límites de recursión, alterar niveles): pasan por el protocolo `plan_trabajo/06` (consejo aplicado al cambio + decisión de la persona responsable + fila en su bitácora §5 + puntero en log.md). Cambios menores (redacción, anclas nuevas): edición libre con huella en log.
4. **Estados:** las reglas de esta skill portan los estados de 06 §2.5 (vigente/provisional/secundaria/en revisión/revertida). Hoy todo nace `vigente` salvo la dosificación fina de CONDENSADO, que queda `provisional` hasta acumular 3 usos.
5. **Deuda de validación declarada:** n=5 aplicaciones al 2026-08-19 (las tres de origen, más la reorganización de `textos/` del 13-08 y el análisis de las correcciones del profesor de TM del 19-08), todas sobre arquitectura o escritura del propio sistema. Falta probar el método en una decisión TEÓRICA de tesis (p. ej., un dilema de marco o de operacionalización); esa primera aplicación decide si el consejo necesita un sexto rol disciplinar (asesor metodólogo) o si los 5 bastan. No agregar el rol antes de esa evidencia (anti-oversizing).
6. **Revisión por cadencia:** entra en la revisión post-deadline de 06 §3 como cualquier protocolo.

## 9. Cómo se construyó esta skill (el método aplicado a sí mismo, nivel COMPLETO)

| Asesor | OODA condensado | Cambio concreto en la skill |
|---|---|---|
| **Contrario** | Observó una skill que invoca consejos y OODAs → orientó: el fallo probable es que analizar se vuelva más caro que decidir, y que se use para aplazar decisiones → decidió exigir techo y salida rápida → actuó | §2 "NO activar" con el costo de decidir; F4 en el banco; nivel RÁPIDO |
| **Primeros Principios** | Observó "perfeccionar la combinación" como pedido → orientó: la pregunta real no es combinar más, sino fijar QUÉ pieza va en QUÉ fase (la composición, no la suma) → decidió que ese fuera el corazón → actuó | §3 arquitectura de composición (OODA exterior, principios en Orient, consejo en Decide) |
| **Expansionista** | Observó que el método ya rindió 3 veces → orientó: el 10x es que TODA decisión sustantiva futura pase por aquí sin re-derivar nada, y que la skill componga con las demás → decidió declarar composición → actuó | §2 "puede envolver" a auditoría/voz; `logica_fable` deriva aquí; linaje §1 |
| **Forastero** | Observó jerga densa (OODA, anclas, facetas) → orientó: alguien nuevo no sabría ni cuándo usarla ni qué entrega → decidió exigir tablas de activación y formato de salida explícitos → actuó | §2 listas activar/no activar; §7 formato por nivel |
| **Ejecutor** | Observó que la skill podía quedar en manifiesto → orientó: el lunes importa que la próxima decisión real la use sin fricción → decidió dejar el arranque en una línea → actuó | §4 "declarar el nivel al arrancar"; deuda de validación §8.4 como primera tarea natural |

**Revisión anónima:** la más sólida fue la composición (resuelve el problema real: las piezas ya existían, faltaba su gramática). El mayor punto ciego: ninguna respuesta definió el costo de contexto del nivel COMPLETO en sesiones largas (mitigación: interrumpibilidad §5.5 y documentación condensada). Factor omitido por las cinco: qué pasa cuando el consejo y la persona responsable discrepan; resuelto por herencia: el consejo propone, la persona responsable decide (01 §3, 06 §4.2).

**Presidente:** skill vigente. Su valor está en la composición fija y la dosificación, no en agregar herramientas. Paso inmediato: usarla en la próxima decisión sustantiva del sistema y registrar el ancla n=4.
