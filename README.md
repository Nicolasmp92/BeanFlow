# BeanFlow (v2)

Starter kit full-stack para proyectos propios. Reemplaza al kit Laravel/Livewire
(v1, conservada en la historia de git) por un stack API-first multi-cliente:
Angular 22 SSR para web y JWT Bearer para clientes móviles (Flutter).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Angular 22 standalone + signals, SSR Express 5, Tailwind CSS 4, CDK headless |
| Backend | Spring Boot 3.5, Java 17, Spring Security stateless, Spring Data JPA |
| BD | PostgreSQL (default) — H2 disponible para modo dev sin BD externa |
| Auth | JWT HS256 dual: cookie `httpOnly + SameSite=Strict` (web) / `Bearer` (móvil) |
| Tests | Vitest (front), JUnit + H2 (back) |
| Tooling | npm, Maven, angular-eslint, Prettier + plugin Tailwind |

## Alcance (MVP acotado)

El kit incluye **solo** el piso transversal: auth JWT dual, usuarios CRUD con
roles `admin`/`user`, health check, dominio `items` de ejemplo (CRUD público +
admin), seeder y el paquete metodológico `.devin/`. Todo lo demás (audit,
notificaciones, settings, media) queda en backlog y entra solo si **dos
proyectos reales** lo necesitan — esa es la regla anti scope-creep.

## Estructura

```text
├── src/                  # Angular: core/ (auth, guards, shell) + shared/ + features/
├── backend/              # Spring Boot: auth/ usuarios/ items/ health/ seed/ config/
├── proxy.conf.cjs        # dev-server :4201 → /api → :8081
├── src/server.ts         # SSR :4001 → /api → BEANFLOW_API_URL
├── .devin/               # metodología: skills + reglas (ver inyector-skill.md)
└── inyector-skill.md     # enrutador de skills del proyecto
```

## Arranque rápido

### 1. Backend (default: PostgreSQL)

```bash
createdb beanflow && createuser beanflow_user --pwprompt   # o vía sudo -u postgres
cd backend
BEANFLOW_DB_URL=jdbc:postgresql://localhost:5432/beanflow \
BEANFLOW_DB_USER=beanflow_user BEANFLOW_DB_PASSWORD=<clave> \
mvn spring-boot:run                            # API en :8081
```

### 1bis. Backend sin PostgreSQL (H2 en memoria)

```bash
cd backend
BEANFLOW_DB_URL='jdbc:h2:mem:beanflow;DB_CLOSE_DELAY=-1' \
BEANFLOW_DB_USER=sa BEANFLOW_DB_PASSWORD='' \
mvn spring-boot:run                            # API en :8081
```

### 2. Frontend dev

```bash
npm install
npm start          # :4201 con proxy /api → :8081
```

### 3. Frontend SSR (producción local)

```bash
npm run build
BEANFLOW_API_URL=http://localhost:8081 node dist/beanflow/server/server.mjs   # :4001
```

Credenciales seed (solo dev): `admin@beanflow.dev` / `beanflow-admin-2026` — configurables
con `BEANFLOW_SEED_CORREO` / `BEANFLOW_SEED_CLAVE`.

## Variables de entorno

| Variable | Default dev | Uso |
|---|---|---|
| `BEANFLOW_DB_URL` | `jdbc:postgresql://localhost:5432/beanflow` | Datasource JDBC |
| `BEANFLOW_DB_USER` / `BEANFLOW_DB_PASSWORD` | `beanflow_user` / `beanflow_dev` | Credenciales BD |
| `BEANFLOW_JWT_SECRET` | dev-only | **Obligatorio en producción** |
| `BEANFLOW_JWT_HORAS` | `12` | Duración de sesión |
| `BEANFLOW_COOKIE_SECURE` | `false` | `true` detrás de HTTPS |
| `BEANFLOW_SEED_CORREO` / `BEANFLOW_SEED_CLAVE` | admin dev | Usuario inicial |
| `BEANFLOW_API_URL` | `http://localhost:8081` | Target del proxy SSR |
| `PORT` | `4001` | Puerto del SSR |

## Mapa de puertos (esta máquina es server dev compartido)

| Proyecto | API | Dev front | SSR |
|---|---|---|---|
| DSpace-CRIS (reservado) | 8080 | 4200 | 4000 |
| BeanFlow | 8081 | 4201 | 4001 |
| Frunexis | 8082 | 4202 | 4002 |
| sconect (futuro) | 8083 | 4203 | 4003 |

## Verificación

```bash
npm run build && npm test && npm run lint   # frontend
cd backend && mvn -q test && mvn -q package # backend
```

## Seguridad

- Cookie JWT `httpOnly + SameSite=Strict`; `Secure` activable por env.
- Login con rate limit en memoria (5 intentos/IP/min).
- Usuarios inactivos no autentican (check en login **y** en el filtro JWT).
- `/api/admin/**` exige `ROLE_ADMIN`; resto de `/api/**` autenticado;
  `/api/health`, `/actuator/health`, login y GET `/api/items` públicos.
- OpenAPI/Swagger público en dev (`/v3/api-docs`, `/swagger-ui`) —
  restringir o desactivar en producción.
- Errores de la API en formato RFC 7807 (`ProblemDetail`); validaciones
  exponen el mapa `errores` campo→mensaje.
- Sin CSRF token: la API es stateless y la cookie va `SameSite=Strict`.
- SSR con whitelist de hosts (`angular.json → security.allowedHosts`) —
  agregar el dominio real en producción.
- Esquema de BD versionado con Flyway (`db/migration/`); Hibernate solo
  valida (`ddl-auto: validate`). Migraciones nuevas = `V<n>__*.sql`.
- Nunca commitear `.env` ni secrets; los defaults de `application.yml` son dev.

## Metodología

El repo incluye el paquete `.devin/` (8 skills de trabajo) y
`inyector-skill.md` como enrutador. Bitácoras: `log.md` (narrativa) y
`registro_actividades.md` (tabla), ambas append-only.
