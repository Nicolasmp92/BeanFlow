---
name: interrogatorio-adopcion
description: Evalua una herramienta, patron, regla o dependencia antes de incorporarla, separando problema, costo, supuestos, version minima y dano potencial. Usala antes de adoptar material externo o una decision dificil de revertir; no la uses para cambios baratos y reversibles.
---

# Interrogatorio de adopcion

## Proposito

Una pieza candidata llega presentada desde la perspectiva de quien la creo. El
interrogatorio obliga a hacer visibles sus limites antes de que otras partes del
sistema empiecen a depender de ella.

## Activacion y abstencion

Activar antes de adoptar una pieza de otro sistema o repositorio, instalar una
dependencia, escribir una regla nueva o tomar una decision cara de revertir.
Leer la pieza antes de interrogarla. No activar para cambios baratos y
reversibles: en esos casos la ceremonia puede costar mas que el riesgo.

## Las cinco preguntas

Responder por escrito y en este orden:

1. **Problema:** que caso concreto resuelve que no resuelva algo ya existente.
   “Mejora la organizacion” no basta; describir el caso observable.
2. **Costo y fallo:** donde falla o cuando es peor que no hacer nada. Declarar
   que disciplina, dependencia o mantenimiento agrega.
3. **Supuesto:** que se esta dando por sentado y como se comprobara antes de
   continuar.
4. **Version minima:** cual es el nucleo que ya aporta valor y que parte puede
   esperar. Adoptar de mas es una forma silenciosa de acumular complejidad.
5. **Afectado:** quien se perjudica si se implementa mal, incluidos terceros
   que no participan de la decision.

Las respuestas 2 y 5 no pueden reducirse a una aprobacion generica: deben
nombrar al menos un costo o modo de fallo, y a quien quedaria expuesto. Si
ambas salen vacias o intercambiables, el interrogatorio no se considera
realizado.

## Veredicto

Registrar exactamente uno:

- **Adoptar:** reescribir en el vocabulario propio, con costo declarado.
- **Adoptar la version minima:** incorporar solo el nucleo y dejar el resto
  como candidato.
- **Descartar:** registrar la razon para no repetir la discusion sin evidencia
  nueva.
- **Medir primero:** definir que mediria la decision y que resultado cambiaria
  el veredicto.

## Limites

Adoptar no es copiar y pegar. La pieza debe pasar por el contrato local de
seguridad, autoridad, dependencias, versionado, reversibilidad y verificacion.
Esta skill no concede permisos ni instala nada por si misma.

## Verificacion y reversibilidad

La salida debe contener las cinco respuestas, el veredicto, la evidencia leida,
el alcance de la adopcion, su costo y la forma de retirarla. Si la adopcion se
realiza, volver a comprobar el caso que la motivo y conservar la version
anterior para rollback.

## Fallos conocidos

- Responder “hace lo mismo pero mejor” sin definir en que ni como medirlo.
- Interrogar la documentacion sin leer la pieza real.
- Declarar “no nos sirve” sin razon recuperable.
- Usar el interrogatorio como permiso automatico para instalar.
- Confundir la version minima con una lista de deseos.

## Escalamiento

Agregar una pregunta o modo de fallo solo cuando una adopcion documentada
salga mal pese a haber pasado el interrogatorio. Registrar el caso y la fecha.

## Procedimiento y formato de salida

El procedimiento es: recuperar la pieza y el contexto, responder las cinco
preguntas con evidencia, elegir un veredicto, declarar alcance y costo, definir
la prueba y la retirada, y solo después someter la adopción a la autorización
que corresponda.

La salida debe conservar: pieza y versión evaluadas, evidencia leída, cinco
respuestas, veredicto único, supuestos, afectados, prueba, costo, autorización
requerida y plan de reversión. Si falta un dato decisivo, el estado es
`Medir primero`, no `Adoptar`.
