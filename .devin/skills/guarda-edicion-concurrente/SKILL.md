---
name: guarda-edicion-concurrente
description: Evita que una sesion o agente pise cambios hechos mientras tanto en archivos compartidos. Exige releer antes de escribir, preferir ediciones puntuales y añadir al final de bitacoras. Usala al tocar archivos que puedan tener mas de un autor o proceso. No la uses en archivos de autor unico dentro de la sesion actual.
tipo: skill
proyecto: [compartido]
funcion: control
estado: candidata
tags:
  - tipo/skill
  - proyecto/compartido
  - funcion/control
  - estado/candidata
---

# Guarda de edicion concurrente

## 1. Riesgo

Una escritura puede terminar correctamente y aun asi perder cambios ajenos
hechos entre la lectura y la escritura. La ausencia de un conflicto tecnico
no prueba que no haya ocurrido una colision.

## 2. Activacion

Activar para configuraciones, bitacoras, listas de tareas, estados, indices y
cualquier archivo que otra persona, agente o sincronizador pueda modificar.

No activar en archivos cuyo unico autor sea la sesion en curso, salvo que el
archivo se haya vuelto compartido.

Señales de concurrencia: fecha de modificacion posterior a la lectura, contenido
que no estaba presente, sincronizacion en la nube o un agente auxiliar con
permiso de escritura.

## 3. Cuatro reglas

1. Leer el archivo en la misma sesion inmediatamente antes de escribir.
2. Preferir un parche puntual a reescribir el archivo completo.
3. En bitacoras y registros, añadir al final.
4. Si el archivo cambio desde la lectura, parar y reportar; no fusionar a ojo.

La sincronizacion en la nube y los agentes auxiliares cuentan como posibles
autores concurrentes.

## 4. Comprobacion previa

Responder tres preguntas antes de escribir:

1. Lo lei en esta sesion?
2. Puedo cambiar solo el fragmento necesario?
3. Si es una bitacora, estoy añadiendo en vez de reescribir?

Solo se escribe si las respuestas son afirmativas. Si no se puede demostrar
que el archivo permanecio estable, se informa la incertidumbre.

El caso que esta guarda debe hacer visible es: leer una version, recibir un
cambio externo y comprobar que la escritura de la version vieja se detiene. Una
escritura exitosa no prueba que no haya perdido contenido.

## 5. Limites

Esto es una guarda de conducta, no un bloqueo tecnico. No evita por si sola
dos escrituras simultaneas. Si el riesgo exige exclusividad real, esta skill
debe producir una solicitud de bloqueo o mecanismo transaccional, no fingir
que ya existe.

## Procedimiento, verificación y no mutación

El procedimiento es leer, comprobar estabilidad, elegir el parche mínimo y
volver a comprobar inmediatamente antes de escribir. Si el archivo cambió, el
procedimiento termina en reporte de colisión.

La salida debe identificar archivo, versión leída, comprobación de estabilidad,
resultado y acción requerida. Esta skill no sobrescribe ni fusiona a ojo; por
eso su reversión consiste en no escribir. Cualquier bloqueo o reparación se
solicita y versiona fuera de esta skill.
