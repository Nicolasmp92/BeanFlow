# Plantillas de auditoría

Usar solo las secciones pertinentes. No convertir la plantilla completa en ritual
para una auditoría pequeña.

## 1. Contrato de auditoría

```markdown
## Contrato

- Objeto y versión:
- Pregunta de auditoría:
- Universo esperado:
- Fuentes de verdad:
- Informes derivados:
- Controles disponibles:
- Acciones autorizadas:
- Acciones prohibidas:
- Criterio observable de cierre:
- Condición de falsación:
```

## 2. Denominadores

```markdown
| Magnitud | Esperado | Observado | Evidencia | Estado |
|---|---:|---:|---|---|
| Archivos | | | | |
| Registros | | | | |
| Parseables | | | | |
| Ejecutados | | | | |
| Aprobados | | | | |
| Pendientes | | | | |
| Excluidos | | | | |
```

## 3. Tabla por ID

```markdown
| ID | Fuente/identidad | Cobertura | Esquema | Mecánico | PDF | Concepto | Pertinencia | Promoción | Acción |
|---|---|---|---|---|---|---|---|---|---|
```

## 4. Discrepancias

```markdown
| ID | Afirmación A | Afirmación B | Evidencia decisiva | Prueba ejecutada | Adjudicación | Residuo |
|---|---|---|---|---|---|---|
```

## 5. Revisión humana

```markdown
### [ID] Problema concreto

- Cita a localizar: “...”
- Autor y obra:
- Ruta absoluta:
- Página/sección/localizador:
- Qué observar:
- Opción A y consecuencia:
- Opción B y consecuencia:
- Estado si no se resuelve: PENDIENTE_HUMANA
```

## 6. Veredictos

```markdown
## Veredictos

### Producto derivado: APTO | APTO_CON_OBSERVACIONES | BLOQUEADO | NO_DISPONIBLE
Razón y gate decisivo.

### Metodología o instrumento: APTO | APTO_CON_OBSERVACIONES | BLOQUEADO | NO_DISPONIBLE
Razón y gate decisivo.

### Integración/promoción: APTO | APTO_CON_OBSERVACIONES | BLOQUEADO | NO_DISPONIBLE
Razón y gate decisivo.
```

No fuerces tres veredictos si solo existe un objeto. Sepáralos cuando una conclusión
global ocultaría estados distintos.

## 7. Cierre reproducible

```markdown
## Pruebas ejecutadas

| Control | Parámetros | Esperado | Ejecutado | Resultado | Código de salida | Límite |
|---|---|---:|---:|---|---:|---|

## Falsación
- Observación que invalidaría el veredicto:
- ¿Se observó?:

## Riesgos residuales
- ...

## Cambios realizados
- ...

## Cambios no realizados
- ...

## Decisiones de la persona responsable
- ...

## Siguiente acción mínima
- ...

## Autoauditoría
- Falso positivo propio corregido:
- Dimensión no cubierta:
- Dependencia de una auditoría previa:
```
