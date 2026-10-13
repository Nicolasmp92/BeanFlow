---
name: continuidad-sesion
description: Retoma trabajo previo desde el estado verificable del disco, no desde la memoria de una conversacion. Comprueba que bitacora, estado, punto de retomada y archivos sigan siendo coherentes antes de continuar. Usala al abrir o cerrar una sesion con trabajo pendiente. No la uses en tareas de una sola sesion sin estado persistente.
tipo: skill
proyecto: [compartido]
funcion: operacion
estado: candidata
tags:
  - tipo/skill
  - proyecto/compartido
  - funcion/operacion
  - estado/candidata
---

# Continuidad de sesion

## 1. Regla dura

No ejecutar trabajo sustantivo hasta comprobar el estado de apertura. La
conversacion es contexto auxiliar; el disco, la bitacora y el punto de
retomada son la evidencia.

La skill cubre dos operaciones inseparables: comprobar la frescura de la
memoria al abrir y dejar un punto verificable al cerrar. Separarlas deja una
sesion que puede reanudarse sin saber si su estado sigue siendo cierto, o una
sesion que sabe donde quedo pero deja trabajo invisible.

## 2. Apertura

El chequeo inicial usa como techo cuatro llamadas y una respuesta de hasta 80
palabras, salvo que una divergencia exija explicar el bloqueo. El presupuesto
evita reconstruir toda la historia antes de comprobar el estado real.

Completar, en este orden:

1. Leer el estado vigente y la ultima entrada de bitacora.
2. Leer el punto de retomada, si existe.
3. Contrastar ambos contra el disco y detectar cambios posteriores.
4. Reportar toda divergencia antes de corregir o continuar.

Señales: rutas inexistentes, archivos nuevos no declarados, trabajo posterior
sin registro, tareas resueltas aun abiertas o estados incompatibles.

## 3. Reanudar un plan

1. Abrir la ruta exacta del plan.
2. Separar completado, en curso, siguiente paso y bloqueos.
3. Revisar cambios posteriores al ultimo punto verificado.
4. Continuar sin rehacer trabajo ya verificado.

Una divergencia es un hallazgo. Corregirla es una accion posterior y debe
quedar separada de la reanudacion.

## 4. Punto de retomada

Guardar solo:

- progreso comprobado;
- ubicacion exacta;
- siguiente paso concreto;
- asuntos abiertos y su dueño.

No convertirlo en diario, transcripcion ni deposito del razonamiento. La
bitacora cuenta; el punto de retomada permite continuar.

## 5. Cierre

Antes de terminar una sesion con trabajo abierto, registrar lo hecho, las
decisiones, los archivos tocados, lo que queda abierto y el siguiente paso.
Cuando la sesion se corte de forma abrupta, la entrada minima de bitacora es
preferible a dejar trabajo invisible.

## 6. Limites

Esta skill no autoriza cambios, no resuelve divergencias y no declara que el
sistema este sano. Solo establece si existe una base verificable para retomar.

## Activación, procedimiento y verificación

Activar al abrir o cerrar una sesión con trabajo pendiente, o después de una
interrupción. El procedimiento mínimo es abrir estado, bitácora y punto de
retomada, contrastar cada uno con el disco, separar divergencias y devolver un
punto de continuación antes de reanudar trabajo sustantivo.

La salida debe declarar progreso comprobado, ubicación, siguiente paso, dueño,
divergencias y cobertura. La skill no muta el sistema; si una reanudación
posterior necesita corregir una divergencia, conserva el estado observado y
registra la corrección como acción separada y reversible.
