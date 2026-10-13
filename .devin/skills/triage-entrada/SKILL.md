---
name: triage-entrada
description: Acota encargos amplios o vagos con un presupuesto numerico y devuelve un trabajo ejecutable sin empezar a ejecutarlo. Usala ante peticiones sin rutas ni criterio, o al entrar por primera vez a un sistema desconocido. No la uses cuando el encargo ya esta acotado.
tipo: skill
proyecto: [compartido]
funcion: razonamiento
estado: candidata
tags:
  - tipo/skill
  - proyecto/compartido
  - funcion/razonamiento
  - estado/candidata
---

# Triage de entrada

## 1. Proposito

Una tarea amplia puede consumir todo el contexto antes de definir que se
necesita. El triage convierte una peticion ambigua en un encargo acotado y
declara lo que aun no se miro.

## 2. Activacion

Activar ante encargos como «revisa esto», «como esta X», «arregla lo que
veas» u «ordena esto», cuando no haya rutas y criterio suficientes. Al entrar a
un sistema desconocido, usarlo solo si el encargo sigue sin poder acotarse.

No activarlo como vuelta ceremonial cuando ya existen ruta, objetivo y
criterio de intervencion.

## 3. Presupuesto inicial

| Recurso | Techo |
|---|---|
| Documentos leidos completos | 2 |
| Llamadas a herramientas | 3 |
| Contexto cargado | aproximadamente 1.600 caracteres |
| Respuesta | 180 palabras |

El techo se puede cambiar solo con dos casos fechados donde haya quedado mal
calibrado. No se relaja en caliente.

## 4. Orden

1. Listar la estructura, como maximo dos niveles.
2. Leer el punto de entrada declarado.
3. Hacer una busqueda dirigida por lo que la peticion nombro.

Al llegar al techo, se detiene el triage. Si el encargo sigue indefinido, esa
indefinicion es la salida.

## 5. Salida

Entregar exactamente:

1. el trabajo real, en una frase;
2. dos o tres rutas concretas;
3. tiempo, permisos y decisiones humanas necesarias;
4. lo que no se miro y por que.

## 6. Limites

En modo triage no se ejecuta, corrige, mueve, renombra ni borra la tarea. El
triage orienta; la fase posterior ejecuta con otro encargo y otra autorizacion.

## Procedimiento, verificación y reversión

El procedimiento es acotar objetivo, ruta, universo, presupuesto, permisos,
decisiones humanas y criterio de cierre antes de proponer una fase posterior.
La salida pasa su verificación solo si contiene exactamente el trabajo real,
rutas, costo, decisiones requeridas y lo que quedó fuera.

El triage no muta el sistema ni inicia la fase posterior; por eso no requiere
rollback. Cualquier ejecución posterior debe tener una autorización y una
bitácora propias.
