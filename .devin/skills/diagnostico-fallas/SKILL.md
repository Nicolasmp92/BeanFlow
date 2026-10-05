---
name: diagnostico-fallas
description: Diagnostica resultados rotos mediante reproduccion, minimizacion, hipotesis previa, instrumentacion y correccion acotada. Usala cuando una falla se reproduce o un resultado no cuadra; no la uses para disenar una solucion sin evidencia.
---

# Diagnostico de fallas

## Regla

No cambiar nada hasta poder explicar por que se rompe. Un parche plausible que
no fue contrastado puede ocultar la falla y destruir la capacidad de aprender
de ella.

## Activacion y abstencion

Activar cuando algo se rompe, un resultado no cuadra, un arreglo anterior falla
o una comprobacion pasa cuando deberia fallar. Si la causa es evidente y
nombrada por el error, resolverla directamente y registrar la razon; esta skill
no decide que construir ni sustituye una skill de diseno.

## Cinco pasos

### 1. Reproducir

Registrar entradas, entorno, version y salida esperada. Si no reproduce, no
declarar una causa ni un arreglo: investigar que era distinto.

### 2. Minimizar

Reducir el caso hasta que quitar un elemento haga desaparecer la falla. El
caso minimizado es instrumento de diagnostico, no reemplazo del caso original.

### 3. Escribir la hipotesis antes de mirar el codigo

Una frase falsable: “creo que falla porque X”. No convertir la primera
anormalidad observada en causa retrospectiva.

### 4. Instrumentar

Buscar evidencia que confirme y evidencia que descarte la hipotesis. Si nada
puede descartarla, es una impresion, no una hipotesis. Registrar tambien las
hipotesis descartadas: evitan repetir el mismo camino.

### 5. Corregir solo lo confirmado

Cambiar la fuente que la evidencia senalo, y nada mas. Ejecutar de nuevo el
caso original, no solo el minimizado. Si el arreglo cambia otra conducta,
separar ambos problemas y volver a diagnosticar.

## Verificacion

Una salida valida contiene: falla reproducida, caso minimizado, hipotesis
fechada, comprobacion a favor y en contra, cambio acotado, resultado del caso
original y control negativo posterior. Una salida no reproducible queda como
`no evaluable`, no como “arreglada”.

## Limites y seguridad

No silenciar excepciones para obtener una salida limpia. No ejecutar acciones
destructivas para fabricar una reproduccion. Toda accion fuera del alcance
declarado requiere autorizacion independiente.

## Fallos conocidos

- Mirar el codigo antes de escribir la hipotesis.
- Cambiar varias cosas a la vez.
- Corregir el sintoma en el consumidor en vez de la fuente.
- Declarar arreglado un caso que no se volvio a correr.
- Omitir el control negativo, dejando un detector ciego.

## Escalamiento

Un nuevo paso entra solo con un caso documentado que los cinco pasos no
resolvieron. Registrar la evidencia y conservar el procedimiento anterior para
comparacion.

## Salida y reversión

La salida se identifica por caso y versión e incluye reproducción, minimización,
hipótesis, evidencia a favor y en contra, cambio aplicado, resultado original y
control negativo. Si la falla no reproduce, el veredicto es `no evaluable`.

La salida debe permitir reconstruir qué se ejecutó, qué evidencia confirmó o
descartó la hipótesis, qué cambió y qué resultado tuvo el caso original.

Antes de corregir, conservar la base y el parche como cambios separados. Si la
corrección no supera el caso original o introduce una regresión, restaurar la
base y registrar el motivo; nunca ocultar la excepción para sostener un `pass`.
