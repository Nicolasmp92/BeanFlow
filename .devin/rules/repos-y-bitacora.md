# Reglas · fronteras entre repositorios e informe diario del front

> Acordado con el coordinador el 2026-09-24. Este repo es la **bitácora y
> documentación central**; el código del frontend y el lab Docker viven en
> repos separados con su propio control de cambios.

## 1 · Frontera entre repositorios

| Repo | Rol | Regla |
|---|---|---|
| `C:\Users\nicolas.munoz\Desktop\repositorios-digitales-uoh` | Documentación, bitácoras, datos fuente, skills | Aquí se trabaja y se commitea |
| `C:\Users\nicolas.munoz\dspace-cris-frontend` | Frontend Angular (git local propio, sin remoto) | **No modificar** salvo pedido explícito en la sesión. **Nunca crear remote ni proponer push**: es código institucional UOH — no sale a GitHub ni a ningún remoto externo (decisión del coordinador 2026-09-28) |
| `C:\Users\nicolas.munoz\dspace-cris-lab` | Lab Docker (compose, configs) | **No modificar** salvo pedido explícito en la sesión |

- Permitido sin pedir: **lectura** de `git status`, `git log`, `git diff` del
  front/lab para verificación, comparaciones e informes.
- Prohibido sin pedir: editar, commitear, crear ramas, stashes o cualquier
  escritura en el front/lab. Los commits del front los hace el usuario o la
  sesión dedicada al front.
- Si un pedido ambiguo podría implicar tocar el front (ej. "revisa el front"),
  aclarar primero si es solo lectura o también escritura.

## 2 · Informe diario del front

Cuando el usuario pida "el informe del front", "qué se trabajó hoy" o similar:

1. Leer la actividad del repo del front:
   ```bash
   cd /c/Users/nicolas.munoz/dspace-cris-frontend
   git log --since="YYYY-MM-DD 00:00" --oneline --stat
   git status --short   # trabajo sin commitear
   ```
2. Redactar entrada de bitácora con: commits del día (hash + mensaje),
   archivos tocados por área (tema custom, rutas, i18n), trabajo sin
   commitear si existe, y observaciones (tests/lint si se corrieron).
3. Guardarla en este repo en `DSPACE-CRIS/log.md` (sección del día,
   subsección "Front") — o en `DSPACE-CRIS/docs/bitacora-frontend.md` si la
   frecuencia crece y conviene archivo propio.
4. Commitear y pushear como de costumbre.

## 3 · Sincronización multi-máquina (recordatorio)

- `git pull --rebase` **antes** de empezar a escribir en archivos compartidos
  (la otra máquina trabaja el mismo repo).
- Push inmediato después de cada commit de documentación.
- Ver `guarda-edicion-concurrente` para el protocolo completo.
