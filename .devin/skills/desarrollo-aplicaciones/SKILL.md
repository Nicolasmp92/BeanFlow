---
name: desarrollo-aplicaciones
description: Disena, desarrolla, reestructura y valida aplicaciones con primeros principios, OODA acotado, tres ramas ToT, consejo de cinco y GEPA controlado. Integra experiencia de usuario para personas no tecnicas, escalabilidad, flexibilidad, mantenimiento, seguridad, portabilidad y reproducibilidad. Usala al crear una aplicacion, migrar una herramienta, convertir un prototipo en producto o revisar su arquitectura. No la uses para una correccion aislada ni para sustituir una skill especifica de documentos, hojas de calculo o presentaciones.
---

# Skill: Desarrollo de aplicaciones

## 1. Proposito

Esta skill convierte una necesidad de usuario en una aplicacion operable,
trazable y mantenible. No trata la interfaz, el codigo y la distribucion como
trabajos separados: los conecta mediante un mismo contrato de producto.

Su linaje metodologico es `exploracion_analisis`, pero no la modifica ni la
sustituye. Esta skill especializa ese metodo para decisiones de producto,
arquitectura e implementacion.

El objeto central no es una pantalla ni un archivo fuente. Es una cadena
reproducible:

```text
problema y usuario -> flujo -> modelo -> interfaz -> transformacion -> salida
                     -> verificacion -> distribucion -> mantenimiento
```

Si un eslabon no tiene dueno, contrato o criterio de verificacion, el producto
esta incompleto aunque la demo funcione.

## 2. Cuando activarla

Activar cuando el trabajo incluya al menos una de estas situaciones:

- crear una aplicacion nueva desde una necesidad de usuario;
- migrar un script, notebook o herramienta a una interfaz utilizable;
- reestructurar una aplicacion cuyo crecimiento produjo duplicacion o fragilidad;
- hacer una aplicacion portable, offline, local-first o sin instalacion;
- introducir una plantilla, formato, adaptador, integracion o generador nuevo;
- evaluar si un prototipo esta listo para uso real.

No activar para:

- una consulta tecnica puntual sin cambio de producto;
- una correccion pequena cuyo contrato y criterio ya estan establecidos;
- redactar contenido sin decision de producto;
- editar una presentacion, hoja o documento cuando ya existe una skill de
  formato que gobierna esa operacion.

Cuando una skill especifica gobierne una parte del trabajo, esta skill puede
coordinar la arquitectura, pero no invalida su protocolo especializado.

## 3. Reglas no negociables

1. **Verdad en disco.** Antes de afirmar que existe, funciona, se exporta o se
   valida algo, comprobarlo en los archivos, artefactos o pruebas disponibles.
2. **No rellenar incertidumbre.** Separar hechos, inferencias, supuestos e
   incertidumbres. Preguntar solo lo que no puede derivarse con seguridad.
3. **Leer ancho, actuar angosto.** Inspeccionar el contexto suficiente para no
   romper contratos; modificar solo el alcance autorizado.
4. **Primero una linea vertical.** Antes de construir muchas pantallas o
   abstracciones, hacer funcionar un recorrido completo y pequeno.
5. **Prevenir antes que advertir.** Si una combinacion produce una salida rota,
   bloquearla antes de exportar; una advertencia no equivale a una aprobacion.
6. **Una fuente de verdad.** El modelo, el registro, la plantilla o la regla
   canonica no se duplican en configuraciones silenciosas.
7. **Reversible por defecto.** Toda mutacion masiva, eliminacion, migracion o
   cambio de formato exige respaldo, alcance, registro y ruta de retorno.
8. **La salida valida el producto.** Una aplicacion no esta terminada porque el
   codigo compila: su salida debe abrirse, conservar el contenido y poder
   repetirse bajo las condiciones declaradas.
9. **El agente no decide por la persona.** Propone, muestra consecuencias y
   registra; las decisiones de alcance, contenido sensible o publicacion quedan
   explicitas.

## 3bis. Principios ampliados y pruebas observables

"Mantenible", "escalable" y "usable" no son aprobaciones. Son propiedades que
deben traducirse a una prueba, un umbral o una evidencia. Usar esta tabla para
evitar que un adjetivo sustituya al diseno:

| Principio | Traduccion operativa | Prueba minima |
|---|---|---|
| Primeros principios | Separar necesidad, invariantes, restricciones y mecanismos; cuestionar cada capa que no resuelva una de las tres primeras. | Otra persona puede explicar por que existe cada frontera principal. |
| Valor de usuario | Medir el trabajo completo, no la cantidad de funciones. | Un usuario del perfil objetivo termina el flujo con una entrada real y sabe que la salida es valida. |
| No tecnico | La interfaz traduce estados, errores y decisiones; no exige nombres de modulos, rutas ni formatos internos. | El recorrido principal se completa sin editar archivos ni usar una consola. |
| Escalabilidad | Declarar el eje que crece: volumen, usuarios, formatos, recursos, reglas, agentes o frecuencia. | Un caso de crecimiento representativo no exige duplicar el modelo ni tocar el nucleo sin justificacion. |
| Flexibilidad | Extender mediante contratos, registros y adaptadores, no mediante excepciones hardcodeadas. | Una segunda variante se expresa con configuracion o un adaptador y pasa las mismas pruebas. |
| Mantenimiento | Reducir el costo de localizar, comprender, cambiar, probar y revertir una pieza. | Un mantenedor externo encuentra el punto de cambio, ejecuta la prueba y entiende el rollback. |
| Seguridad | Tratar entradas, secretos, permisos, dependencias y operaciones peligrosas durante todo el ciclo. | Hay una prueba positiva y una negativa para cada frontera de riesgo relevante. |
| Portabilidad | Declarar sistema operativo, navegador, runtime, dependencias, datos y modo de entrega. | El artefacto funciona en un entorno limpio dentro del contrato declarado. |
| Reproducibilidad | Fijar fuente, entorno, instrucciones y artefactos esperados; registrar variaciones inevitables. | Dos ejecuciones comparables producen el mismo resultado o una diferencia explicada y aceptada. |
| Observabilidad | Registrar suficiente contexto para responder que ocurrio, donde, con que version y con que resultado. | Un fallo puede localizarse desde el registro sin repetir toda la sesion manual. |

La escalabilidad no autoriza distribuir prematuramente ni introducir servicios.
La flexibilidad no autoriza un lienzo sin reglas. La portabilidad no significa
que todos los entornos sean equivalentes. La simplicidad se conserva mientras
cumpla el contrato; se abandona solo frente a evidencia de que ya no lo cumple.

La seguridad no es una inspeccion final. NIST SSDF la formula como practicas
integrables al ciclo de desarrollo, y OWASP ASVS como requisitos verificables
con version. Por eso cada riesgo relevante debe tener control, prueba, estado y
responsable antes de la entrega. No declarar cumplimiento normativo completo a
partir de una lista parcial.

La accesibilidad tampoco es una preferencia visual. Para aplicaciones web usar
WCAG 2.2 como referencia de criterios comprobables: perceptible, operable,
comprensible y robusta. Declarar el nivel y el alcance; si solo se hicieron
pruebas automaticas o una muestra, marcar la evaluacion como parcial.

## 4. PonyTail: control de la cola de complejidad

`[SUPUESTO]` No existe una definicion tecnica transversal de "PonyTail" en el
material disponible. En esta skill se adopta una definicion operacional,
revisable por el usuario:

> Cada capacidad nueva debe engancharse a la misma cola de producto: intencion,
> modelo, interfaz, salida, prueba y mantenimiento. No debe abrir una segunda
> via paralela que solo funcione en la demo.

Antes de anadir una capacidad, responder:

- ?reutiliza el modelo y los contratos existentes?
- ?tiene una ruta de interfaz comprensible?
- ?produce la misma salida por la misma entrada?
- ?puede probarse sin depender de una sesion manual irrepetible?
- ?queda documentada su instalacion, uso, rollback y mantenimiento?

Si alguna respuesta es no, la capacidad es una cola suelta. No se integra como
funcion normal: se marca como prototipo, deuda o decision pendiente.

## 4bis. README, log y memoria de mantenimiento

La ausencia de orientacion es un defecto de producto, no un detalle editorial.
En la primera entrada al proyecto crear o auditar estos artefactos:

### README.md: orientacion actual

Debe existir en la raiz de toda aplicacion. Si una subcarpeta tiene un punto de
entrada, ciclo de vida o contrato independiente, puede tener su propio README;
no crear READMEs por rutina en carpetas puramente internas.

El README de raiz debe responder, en lenguaje comprensible:

- que problema resuelve y para quien;
- que puede hacer y que no promete;
- como se inicia o abre, incluyendo el camino de una persona no tecnica;
- entradas, salidas, formatos y ubicacion de los datos del usuario;
- dependencias reales y condiciones de portabilidad;
- estructura minima del proyecto y fuente de verdad;
- como verificar que funciona y como recuperar un fallo;
- quien mantiene el proyecto y donde se informa un problema;
- estado, version, limitaciones y decisiones pendientes.

No rellenar secciones con informacion inventada. Si un dato no se conoce,
escribirlo como `[INCERTIDUMBRE]` o dejar una pregunta explicita. Los enlaces
internos deben ser relativos y verificables en la copia del proyecto. El README
describe el estado actual, no el estado deseado.

### log.md: historia operacional

Crear `log.md` al iniciar el proyecto, antes de la primera decision sustantiva.
Es append-only: una entrada nueva puede corregir una conclusion anterior, pero
no borra silenciosamente su huella.

Cada entrada debe contener como minimo:

```markdown
## YYYY-MM-DD - evento breve

- Actor:
- Accion:
- Evidencia o ruta:
- Decision o resultado:
- Estado: confirmado | probable | exploratorio | ambiguo | no evaluable
- Riesgo o contradiccion:
- Proximo paso:
```

Registrar decisiones, preguntas del usuario, supuestos, cambios de contrato,
fallos, controles negativos, resultados de pruebas, cambios de dependencias,
versiones, migraciones y entregas. Un log de runtime, si existe, es otro
artefacto: no reemplaza esta bitacora de proyecto.

### Consistencia README-log-disco

Al cerrar cada etapa comprobar:

1. el README describe lo que realmente existe en disco;
2. el log permite reconstruir por que se llego al estado actual;
3. las rutas, comandos, versiones y artefactos mencionados existen o estan
   marcados como no evaluables;
4. las decisiones pendientes no aparecen como capacidades terminadas;
5. la ultima entrada del log explica el cambio mas reciente.

Si la aplicacion tiene releases o una interfaz publica, agregar `CHANGELOG.md`
como comunicacion humana de cambios notables. No usarlo como bitacora de cada
commit: `README.md` orienta, `log.md` preserva la historia de ejecucion y
`CHANGELOG.md` comunica cambios de version. SemVer solo aplica si se declara
una API, formato, esquema o interfaz versionada.

## 5. Ciclo OODA aplicado al desarrollo

Cada etapa sustantiva corre un OODA acotado. El nivel se declara al comienzo:

- **Completo:** decision arquitectonica, migracion, nuevo formato o riesgo alto.
- **Condensado:** feature con impacto acotado y contratos ya conocidos.
- **Rapido:** cambio local, reversible y cubierto por una prueba existente.

### Observe

Levantar evidencia antes de disenar:

- archivos, entradas, salidas, dependencias y limites del sistema;
- flujo actual de una persona real y puntos donde falla;
- entorno de ejecucion y restricciones de instalacion;
- decisiones ya declaradas, contratos existentes y deuda conocida;
- datos sensibles, permisos, operaciones destructivas y artefactos derivados;
- criterios de exito y ejemplos de entrada/salida.

No ejecutar scripts, abrir datos sensibles ni usar artefactos latentes solo
porque existen. La autorizacion para una operacion concreta no se extiende por
analogia a otras operaciones.

### Orient

Reducir el problema a primeros principios:

1. ?Que trabajo intenta completar la persona?
2. ?Cual es la entrada minima y cual es la salida que puede verificar?
3. ?Que invariantes no pueden romperse?
4. ?Que parte requiere juicio humano y que parte puede automatizarse?
5. ?Que debe ocurrir si falta un recurso, falla una dependencia o el contenido
   excede los limites?

Separar intencion, modelo, presentacion, persistencia y exportacion. No usar la
interfaz como base de datos ni una salida generada como fuente de verdad.

### Tres ramas ToT exactas

Para toda decision sustantiva comparar exactamente estas tres ramas:

| Rama | Criterio |
|---|---|
| A - Conservar | Mantener la arquitectura y hacer el cambio minimo, reversible y medible. |
| B - Reparar | Cambiar unicamente el componente que explica una falla observada, agregando una prueba de regresion. |
| C - Redisenar | Cambiar el contrato o la topologia porque las dos ramas anteriores no pueden cumplir los invariantes. |

Evaluar las tres en seguridad, correccion, experiencia de usuario, portabilidad,
reproducibilidad, extensibilidad, mantenimiento, coste y reversibilidad. No
crear una cuarta rama con otro nombre. Si la decision es trivial, declarar que
se usa nivel Rapido y omitir el desarrollo formal de ToT.

### Consejo de cinco

Para decisiones de arquitectura, UX o distribucion, examinar la opcion elegida
desde cinco roles:

- **Contrario:** ?que la puede romper y que supuesto esta ocultando?
- **Primeros Principios:** ?sigue resolviendo el problema elemental o anade
  complejidad accidental?
- **Expansionista:** ?permite crecer sin duplicar modelos, reglas o procesos?
- **Forastero:** ?la entiende una persona no tecnica sin conocer la arquitectura?
- **Ejecutor:** ?puede construirse, probarse y mantenerse con los recursos reales?

Despues de las cinco criticas, hacer revision anonima: identificar el riesgo que
ningun rol cubrio. La decision debe incluir una condicion de falsacion concreta.

### Decide

Elegir una rama o declarar que la decision queda bloqueada. Registrar:

- problema y alcance;
- evidencia usada y evidencia ausente;
- las tres ramas y lo que se descarta de cada una;
- decision, responsable y autoridad que la aprobo;
- riesgos, condicion de falsacion y plan de retorno;
- criterio observable de salida de la etapa.

### Act

Implementar el menor incremento que pueda demostrar el criterio de salida:

1. cambiar una frontera a la vez;
2. ejecutar la prueba o verificacion correspondiente;
3. revisar la salida real, no solo el codigo;
4. registrar lo aprendido y actualizar el contrato si corresponde;
5. continuar solo si la compuerta de calidad cierra.

## 6. Ciclo de construccion

### Etapa 0 - Red de seguridad

Antes de modificar el sistema:

- declarar destino, alcance, responsable, entorno y modo de distribucion;
- crear o auditar `README.md` y crear `log.md` antes de la primera decision
  sustantiva;
- medir estructura, tamano, fechas y tipos relevantes;
- identificar repositorio, respaldo, remoto, secretos y datos sensibles;
- confirmar permisos y limites de agentes auxiliares;
- tomar una linea base versionada o una copia fechada verificable;
- definir rollback y control negativo.

No mover, renombrar, borrar ni migrar en masa antes de que la linea base sea
recuperable. Si la aplicacion debe funcionar sin instalacion, separar desde
ahora las dependencias de desarrollo de las de distribucion: "sin instalacion"
no significa "sin compilacion durante el desarrollo".

### Etapa 1 - Descubrimiento y contrato

Documentar el trabajo real de la persona, no solo la lista de funciones.
Producir:

- usuario principal, usuarios secundarios y contexto de uso;
- flujo feliz, errores esperables y recuperacion;
- entradas, salidas, formatos y limites;
- restricciones de offline, navegador, sistema operativo e instalacion;
- modelo de datos con IDs, versiones, procedencia y compatibilidad;
- catalogo de requisitos atendidos y no atendidos.

La entrevista pregunta unicamente lo que la lectura no puede resolver. Una
pregunta omitida por el agente es un defecto del proceso y se registra.

### Etapa 2 - Experiencia de usuario

Disenar desde el trabajo que se quiere completar:

- entrada clara y primer paso visible;
- lenguaje de usuario, no nombres internos de modulos;
- estados vacio, cargando, exito, advertencia, error y recuperacion;
- validacion cercana al campo que puede corregirse;
- prevencion de acciones destructivas y confirmacion comprensible;
- accesibilidad de teclado, contraste, tamano, foco y lectura;
- criterios WCAG aplicables y alcance real de la evaluacion;
- comportamiento coherente en el tamano de pantalla previsto;
- vista previa de la salida real cuando exista una exportacion;
- guardado, apertura y recuperacion sin perder trabajo.

Una interfaz para no tecnicos no oculta los estados: los traduce. "No se pudo
abrir" debe decir que archivo, por que es probable que ocurriera y que puede
hacer la persona a continuacion.

### Etapa 3 - Arquitectura

Definir antes de ampliar la UI:

- nucleo de dominio independiente de la interfaz;
- adaptadores para archivos, navegador, sistema operativo y exportadores;
- esquema versionado y migraciones explicitas;
- registro unico de plantillas, recursos, comandos o extensiones;
- limites de modulos y contratos entre ellos;
- estrategia de fallos, datos faltantes y compatibilidad;
- modelo de amenazas, fronteras de confianza y controles de seguridad;
- presupuesto de dependencias y estrategia de distribucion;
- observabilidad suficiente para explicar una salida incorrecta.

Preferir datos declarativos y transformaciones deterministas. No hacer que cada
plantilla, pantalla o formato obligue a modificar el nucleo. No prometer un
importador universal si solo se ha probado un subconjunto del formato.

### Etapa 4 - Implementacion incremental

Construir una linea vertical minima: entrada real, flujo visible, salida real y
prueba. Luego ampliar en capas:

1. modelo y validacion;
2. flujo principal;
3. persistencia y recuperacion;
4. recursos y variantes;
5. exportacion o integracion;
6. errores, accesibilidad y rendimiento.

Cada capa debe poder inspeccionarse de forma aislada. Mantener el formato
anterior mediante un adaptador cuando una migracion todavia no tenga paridad.
No reemplazar una salida conocida por una nueva solo porque la nueva "parece"
equivalente.

### Etapa 5 - Verificacion

Verificar como minimo:

- **funcional:** el flujo principal produce la salida esperada;
- **modelo:** esquema, IDs, referencias y versiones son validos;
- **negativa:** entradas invalidas, recursos ausentes y limites rompen de forma
  segura y visible;
- **regresion:** los casos previos siguen funcionando;
- **consistencia:** interfaz, modelo y salida no divergen;
- **seguridad:** secretos, permisos, rutas, contenido y operaciones peligrosas;
- **portabilidad:** el artefacto funciona en el entorno declarado;
- **reproducibilidad:** misma entrada, version y configuracion producen el
  mismo resultado o explican toda variacion;
- **usuario:** una persona no tecnica completa el recorrido sin editar codigo.

Para exportaciones visuales, comparar la vista previa con el artefacto final.
Para archivos complejos, abrir y validar el archivo con las herramientas
disponibles; si la aceptacion de una aplicacion externa no puede automatizarse,
marcarla `no evaluable`, nunca `aprobada`.

### Etapa 6 - Distribucion y mantenimiento

Entregar junto con la aplicacion:

- disparador y pasos de uso para una persona no tecnica;
- version del esquema, version del motor y procedencia de recursos;
- ejemplo minimo y casos de prueba reproducibles;
- reporte de validacion y limitaciones conocidas;
- README actualizado, log append-only y, si corresponde, CHANGELOG de cambios
  notables;
- mecanismo de actualizacion o instrucciones de reemplazo;
- rollback y ubicacion de los datos del usuario;
- log de cambios, decisiones y deuda tecnica.

Un unico archivo puede ser un artefacto de distribucion valido, pero no debe
forzar que el codigo fuente, el modelo, los recursos y todas las pruebas sean un
monolito. La fuente debe mantenerse modular y el empaquetado debe ser generado.

## 7. Compuerta de calidad por etapa

Ninguna etapa se cierra preguntando solo "?se hizo?". Al cierre responder y
registrar:

1. **Cobertura:** ?que requisito, caso, archivo o riesgo del catalogo quedo sin
   atender y esta declarado?
2. **Autocritica:** contra los criterios escritos de esta etapa, ?donde fallo la
   salida o que no pudo verificarse?
3. **Triple consistencia:** ?la salida coincide con el disco, con las decisiones
   del usuario y con la etapa anterior?
4. **Aprendizaje:** ?que se aprendio y en que artefacto queda escrito para la
   siguiente etapa?
5. **Reversibilidad:** ?que cambio, bajo que autoridad, con que respaldo y como
   se vuelve atras?
6. **Documentacion:** ?README, log y, cuando corresponda, CHANGELOG describen
   sin contradicciones el estado que quedo en disco?

Una respuesta "sin hallazgos" exige mostrar que catalogo se reviso. Si el control
negativo no detecta una violacion deliberada, el gate falla: no se puede afirmar
que una guarda funciona porque el caso normal paso.

## 8. Autorizacion y agentes auxiliares

Usar esta matriz antes de actuar:

| Regimen | Accion |
|---|---|
| **HACE** | Lecturas, analisis, pruebas no destructivas y cambios dentro del alcance explicito. |
| **PROPONE** | Arquitectura, diseno, migraciones, eliminacion, publicacion o cambios de contrato. |
| **PIDE PERMISO** | Operaciones destructivas, masivas, externas, sobre datos sensibles o fuera de la jaula. |
| **NO** | Ejecutar codigo latente sin autorizacion, ocultar incertidumbre, ampliar permisos o declarar aprobacion por cuenta propia. |

Si se usa un agente auxiliar:

- confirmar destino, contenedor y jaula antes de despacharlo;
- limitarlo a lectura y al directorio de trabajo autorizado;
- exigir cada hallazgo con **AFIRMACION, RUTA, COMPROBACION y ESTADO**;
- tratar su salida como insumo, nunca como verdad;
- contrastar sus afirmaciones en disco antes de incorporarlas;
- no usarlo para decidir alcance, contenido o aprobacion final.

## 9. Marcas epistemicas obligatorias

Usar, como minimo:

- `[HECHO VERIFICADO]` para evidencia comprobada;
- `[INFERENCIA]` para una conclusion derivada;
- `[SUPUESTO]` para una hipotesis de trabajo;
- `[INCERTIDUMBRE]` cuando falta evidencia decisiva;
- `[NO AUTORIZADO]` cuando la operacion esta fuera de permiso;
- `[VINCULANTE]` para una regla que no debe omitirse.

No convertir una advertencia en aprobacion ni un silencio en decision.

## 10. GEPA para mejorar la skill o el protocolo

Activar GEPA solo cuando el usuario autorice evolucionar esta skill, el protocolo
de desarrollo o un contrato estable del proyecto. No usarlo para justificar
parches de una implementacion.

Procedimiento minimo:

1. conservar una linea base funcional;
2. formular una sola mutacion sustantiva;
3. probarla en un holdout que no haya guiado su diseno;
4. comparar por seguridad, correccion, UX, portabilidad, reproducibilidad y
   mantenimiento;
5. registrar lo que mejora, lo que empeora y lo que no se adopta;
6. limitar a dos generaciones o dos pasadas;
7. mantener la candidata separada hasta aprobacion humana.

La condicion de promocion no es que la salida se vea mejor: debe mejorar un
criterio sin romper los invariantes ni inflar la cola de complejidad.

## 11. Formato de entrega

Cada incremento sustantivo deja un registro con esta estructura:

```markdown
## Decision / incremento

- Problema:
- Usuario y flujo afectado:
- Evidencia en disco:
- Alcance autorizado:
- OODA: completo | condensado | rapido
- Rama elegida: A | B | C
- Alternativas descartadas:
- Consejo de cinco:
- Cambio realizado:
- Verificaciones y control negativo:
- Que queda sin verificar:
- Rollback:
- Condicion de falsacion:
- Proximo gate:
```

La entrega final debe incluir siempre: artefacto ejecutable o instrucciones de
uso, cambios realizados, pruebas, limitaciones, decisiones pendientes y la
ubicacion del log. Si no puede entregar alguno, declararlo como hueco.

## 12. Fallos que esta skill debe interceptar

- construir una demo sin flujo completo ni salida verificable;
- anadir una pantalla para cada caso sin estabilizar el modelo;
- hardcodear una plantilla, ruta, usuario o entorno dentro del nucleo;
- declarar "portable" una aplicacion que depende de instalaciones ocultas;
- aceptar cualquier archivo sin contrato ni validacion de procedencia;
- confiar en una vista previa distinta del exportador;
- reparar sintomas con parches paralelos en lugar de corregir la frontera;
- dejar errores tecnicos sin una ruta de recuperacion para el usuario;
- usar "escalable" como sinonimo de "mas capas" sin evidencia de crecimiento;
- cerrar un gate sin declarar cobertura, contradicciones y no evaluables.
- crear documentacion al final para justificar retrospectivamente un proyecto
  que nunca tuvo orientacion ni bitacora.

## 13. Criterio de salida

El desarrollo puede considerarse listo para la siguiente etapa unicamente cuando:

- una persona del perfil objetivo completa el flujo principal;
- el modelo y la salida tienen una fuente de verdad identificable;
- las entradas invalidas fallan de forma comprensible y segura;
- existen pruebas positivas, negativas y de regresion proporcionales al riesgo;
- el artefacto puede distribuirse bajo las condiciones declaradas;
- otra persona puede mantenerlo con el log, los contratos y las instrucciones;
- la incertidumbre residual y lo que no se adopta estan escritos.

Este criterio no afirma que el producto sea definitivo. Afirma unicamente que la
etapa tiene evidencia suficiente para continuar sin ocultar sus limites.

## 14. Evidencia adoptada y limites

Estas fuentes se usan como cantera de criterios, no como sustituto del juicio
del proyecto. Las reglas adoptadas estan traducidas arriba y se deben volver a
verificar cuando cambie una version:

- NIST SSDF: seguridad integrada al ciclo, no solo al cierre.
- OWASP ASVS: requisitos de seguridad verificables y referencias versionadas.
- W3C WCAG 2.2: accesibilidad con principios y criterios comprobables.
- Reproducible Builds: fuente, entorno e instrucciones deben permitir recrear
  los artefactos definidos, idealmente byte a byte.
- OpenTelemetry: logs, metricas y trazas son senales distintas; los logs
  estructurados y correlacionables facilitan diagnostico a escala. La skill no
  obliga a instalar OpenTelemetry en aplicaciones pequenas.
- GitHub README y Diataxis: orientar el inicio y separar tutorial, como hacer,
  referencia y explicacion segun la necesidad del lector.
- Keep a Changelog y SemVer: comunicar cambios notables a personas y no
  confundir el changelog con el historial tecnico.
- Skills comunitarias de desarrollo: TDD, modelado de dominio, ADR, revision y
  depuracion basada en hipotesis son patrones opcionales; no se adoptan como
  ceremonia universal sin evidencia de que el proyecto los necesita.

La ficha con URLs, fecha de consulta, veredicto y relacion con los registros
locales vive en `references/evidencia-externa.md`. Si esa referencia no viaja
con la skill, el protocolo interno sigue siendo operativo y estas fuentes se
marcan como contexto no disponible, nunca se rellenan de memoria.
