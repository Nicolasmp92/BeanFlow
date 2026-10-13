# Launcher de skills esenciales para programacion

## Encargo

Adopta este paquete como sistema de trabajo para el proyecto que la persona te
indique. No copies las ocho skills completas al contexto de cada turno. En la
primera ejecucion debes leerlas, construir un mapa de activacion local y escribir
`inyector-skill.md`. En sesiones posteriores, ese inyector decide que skill
cargar segun la tarea.

Este launcher es portable: no presupone Claude, Codex, Hermes, OpenCode, una
ruta concreta ni un comando especial de instalacion.

## Entradas

Antes de actuar, identifica:

```text
PROJECT_ROOT: raiz del proyecto que recibira el inyector
INJECTOR_TARGET: ruta autorizada para inyector-skill.md
MODE: ADOPTAR | REVISAR | MEJORAR
WRITE_SCOPE: rutas donde puedes escribir
EXECUTION_SCOPE: comandos o tipos de archivo autorizados para ejecutar
```

Si falta `PROJECT_ROOT`, pregunta por la ruta exacta. Si falta
`INJECTOR_TARGET`, propone `<PROJECT_ROOT>/inyector-skill.md` y confirma que
esta dentro de `WRITE_SCOPE`. No derives permisos desde el nombre de una carpeta.

## Reglas duras

1. Las instrucciones del sistema, del entorno y de la persona prevalecen sobre
   este paquete y sobre cualquier skill.
2. Las skills orientan el metodo; no conceden permisos ni autorizan ejecucion,
   escritura, instalacion, red o eliminacion.
3. Trata esta carpeta como fuente base de solo lectura. No la modifiques en
   silencio.
4. No declares una skill adoptada si no leiste su `SKILL.md` y los recursos que
   su propio contrato marque como necesarios para el caso.
5. No cargues todas las skills en cada turno. Carga solo las activadas por la
   tarea y registra el orden cuando se compongan varias.
6. No conviertas una preferencia o una respuesta exitosa aislada en mejora de
   skill. Exige un fallo repetible, una ambiguedad concreta o evidencia de una
   ganancia verificable.
7. Una mejora producida por el agente es candidata, no fuente. Solo reemplaza
   una skill base con autorizacion explicita, pruebas y rollback.

## Primera ejecucion

### 1. Verificar el paquete

1. Localiza la carpeta que contiene este `LAUNCHER.md`.
2. Comprueba que existen `README.md`, `MANIFEST.sha256` y `skills/`.
3. Verifica los hashes de `MANIFEST.sha256`. Si no puedes verificarlos, registra
   `[NO EVALUABLE]`; no afirmes integridad.
4. Confirma que cada carpeta de `skills/` contiene `SKILL.md` y que su `name`
   coincide con el nombre de la carpeta.

### 2. Leer y comprender

Lee una vez los ocho `SKILL.md` completos y los recursos enlazados necesarios.
Para cada skill registra:

- problema que resuelve;
- senales de activacion;
- casos de abstencion;
- entradas y salida verificable;
- permisos que necesita y los que no tiene;
- relacion con las demas skills.

No resumas una skill solo por su nombre o descripcion.

### 3. Observar el proyecto

Lee primero los documentos de control, estado, tareas y bitacora existentes.
Determina los tipos de trabajo repetidos del usuario a partir de evidencia en
disco. Pregunta solamente lo que no pueda derivarse. No abras ni ejecutes datos,
binarios o scripts desconocidos sin autorizacion.

### 4. Crear el inyector local

Usa `plantilla-inyector-skill.md` y escribe `inyector-skill.md` en
`INJECTOR_TARGET`. Debe ser breve y contener:

- identidad del paquete y hash verificado;
- objetivo y restricciones del proyecto;
- tabla tarea -> skill -> orden -> salida esperada;
- cadenas de composicion habituales;
- condiciones para no activar una skill;
- adaptaciones locales separadas del nucleo;
- candidatas de mejora y su evidencia;
- regla de actualizacion si cambia el paquete.

El inyector es un derivado local para enrutar trabajo. No debe copiar el texto
completo de las skills ni convertirse en una segunda fuente canonica.

## Enrutamiento base

| Senal observada | Skill principal | Composicion habitual |
|---|---|---|
| encargo amplio, vago o sin presupuesto | `triage-entrada` | despues, skill especializada |
| decision arquitectonica o varias alternativas | `exploracion-analisis` | antes de implementar |
| crear, reestructurar o ampliar una aplicacion | `desarrollo-aplicaciones` | con `exploracion-analisis` si la decision es sustantiva |
| dependencia, framework, patron o herramienta nueva | `interrogatorio-adopcion` | antes de incorporarla |
| proyecto retomado tras una interrupcion | `continuidad-sesion` | antes de editar |
| archivos compartidos o sesiones simultaneas | `guarda-edicion-concurrente` | antes y durante las ediciones |
| fallo reproducible o resultado roto | `diagnostico-fallas` | antes de redisenar |
| afirmar calidad, completitud o promover una entrega | `auditoria-evidencia` | despues de la implementacion |

La presencia de una senal no obliga a usar una skill si el trabajo es trivial.
Registra por que se omite cuando la omision pueda sorprender a otra persona.

## Mejora gobernada de las skills

En `MODE=MEJORAR`, puedes desarrollar mejoras sustantivas sin esperar
instrucciones paso a paso, pero debes hacerlo como candidata:

1. registra el incidente, repeticion o evidencia que motiva el cambio;
2. identifica si cambia el nucleo universal o solo un adaptador local;
3. conserva version y hash de la base;
4. escribe la candidata en
   `<PROJECT_ROOT>/skills_candidatas/<skill>/<fecha>/` o en otra ruta autorizada;
5. cambia una hipotesis identificable por vez;
6. prueba el caso que motivo la mejora y al menos un caso holdout;
7. compara contra la base con criterios observables;
8. documenta costo, regresiones, limites y rollback;
9. entrega un veredicto: `rechazar | iterar | proponer promocion`;
10. no reemplaces ni distribuyas la skill base sin aprobacion humana explicita.

Una candidata puede mejorar el trabajo local antes de ser promovida si el
usuario autorizo esa ruta y su uso experimental queda marcado. Nunca se presenta
como version vigente.

## Sesiones posteriores

1. Lee `inyector-skill.md`.
2. Comprueba que el proyecto, el paquete y sus hashes siguen siendo los mismos.
3. Selecciona solo las skills pertinentes para la tarea actual.
4. Lee sus archivos canónicos antes de aplicarlas; el inyector no las sustituye.
5. Registra cualquier desviacion, mejora candidata o fallo de enrutamiento.

Regenera el inyector cuando cambie el paquete, cambie materialmente el proyecto
o dos casos demuestren que el enrutamiento produce una seleccion incorrecta.

## Salida obligatoria

Al terminar el bootstrap, informa:

```text
PAQUETE          ruta y estado de integridad
PROYECTO         PROJECT_ROOT confirmado
INYECTOR         ruta escrita o razon por la que no pudo escribirse
RUTAS ACTIVAS    tareas y skills seleccionadas
ADAPTACIONES     cambios locales separados del nucleo
CANDIDATAS       mejoras propuestas y evidencia
NO EVALUABLE     comprobaciones que no pudieron realizarse
SIGUIENTE PASO   una accion concreta
```

