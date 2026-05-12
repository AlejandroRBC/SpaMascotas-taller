# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpaMascotas is a full-stack pet spa & shop management system. It has a Spring Boot 4.0.6 backend (Java 21, Maven) and an Angular 21 frontend.

## Commands

### Backend

```bash
# Run the Spring Boot application
cd backend && ./mvnw spring-boot:run

# Build (skip tests)
cd backend && ./mvnw clean package -DskipTests

# Run all tests
cd backend && ./mvnw test

# Run a single test class
cd backend && ./mvnw test -Dtest=ClassNameTest
```

### Frontend

```bash
# Install dependencies
cd frontend && npm install

# Start dev server (http://localhost:4200)
cd frontend && npm start

# Build for production
cd frontend && npm run build

# Lint
cd frontend && npm run lint

# Format with Prettier
cd frontend && npm run format
```

### Database

The app uses PostgreSQL. Connection: `jdbc:postgresql://localhost:5432/SpaMascotasBD` (user: `postgres`, pass: `admin`). The schema is documented in [database_complete_postgres.txt](database_complete_postgres.txt).

## Architecture

### Backend — Layered Architecture

```
Request → Controller → Service → Repository → DB
                          ↓
                      Mapper/DTO
                          ↓
                       Response
```

Package layout under `backend/src/main/java/com/spa/backend/`:

| Package | Responsibility |
|---|---|
| `controller/` | REST endpoints only — no business logic |
| `service/interfaces/` | Service contracts |
| `service/impl/` | All business logic lives here |
| `repository/` | JPA interfaces, no logic |
| `model/` | `@Entity` classes (DB tables) |
| `dto/request/` & `dto/response/` | API contracts; never expose entities directly |
| `mapper/` | Entity ↔ DTO conversion |
| `exception/custom/` & `exception/handler/` | Custom errors + `@ControllerAdvice` global handler |
| `config/security/` | Spring Security, JWT filter (`JwtFiltro`), `JwtUtil` |
| `config/cors/` | CORS (allows `localhost:4200`) |

**Rules:**
- Controllers must only call services and return responses.
- Never access a repository directly from a controller.
- Always use DTOs in responses; never return `@Entity` objects to the client.
- Every service has a matching interface in `service/interfaces/`.

### Frontend — Angular 21 Standalone Components

```
Component → Service → HTTP Interceptor (JWT) → Backend API
```

Key structure under `frontend/src/app/`:

| Folder | Responsibility |
|---|---|
| `core/services/` | Singleton services (auth, clientes, empleados, logs) |
| `core/interceptors/` | `auth.interceptor.ts` — attaches JWT to every request |
| `core/guards/` | Route guards (role-based access) |
| `core/models/` | TypeScript interfaces |
| `pages/auth/` | Login, register, password recovery/reset flows |
| `pages/dashboard/` | Main admin dashboard |
| `pages/clientes/` | Client management |
| `pages/empleados/` | Employee management |
| `pages/logs/` | System logs viewer |
| `layout/` | App shell (sidebar, topbar) |

All components are standalone (no NgModules). Routes are defined in `app.routes.ts` and `pages/pages.routes.ts`.

**Rules:**
- Business logic belongs in services, not components.
- Use `core/` only for singletons needed app-wide.
- JWT token and role are stored in `localStorage` under keys `token` and `rol`.

### Authentication Flow

1. User logs in → `POST /api/auth/login` → receives JWT.
2. JWT stored in `localStorage`.
3. `auth.interceptor.ts` attaches `Authorization: Bearer <token>` to every outgoing request.
4. `auth.guard.ts` checks `localStorage` for a valid token before activating protected routes.
5. Backend validates JWT via `JwtFiltro` on every request.

Roles: `ADMIN`, `EMPLEADO`, `CLIENTE`.

## UI Design Tokens

Defined as CSS variables in `frontend/src/assets/styles.scss`:

| Variable | Value | Usage |
|---|---|---|
| `--color-primario` | `#20B2AA` | Primary actions, nav, branding |
| `--color-acento` | `#FDE047` | Alerts, highlights (always dark text, never white) |
| `--color-capa-1` | `#E0F2FE` | Container/section backgrounds |
| `--color-texto-fuerte` | `#083344` | Titles, high-contrast text |
| `--color-superficie` | `#FFFFFF` | App base background, modals |

**Layer elevation:** Surface (#FFF) → Containers (#E0F2FE) → Modals/popovers (#FFF again).

**Typography:** Urbanist or Montserrat (Google Fonts). H1: 700/32px, H2: 600/24px, Body: 400/16px at 85% opacity, Labels: 600/14px uppercase.

**Accessibility rule:** Never use white text on `--color-acento` (yellow). Use `--color-texto-fuerte` instead.

## Key Configuration

- Backend port: `8080`
- Frontend dev port: `4200`
- JWT expiration: 86400000ms (24 hours)
- Email sender: configured via Gmail SMTP in `application.properties` (all redirected to a single address via BCC — see commit history)
- API base URL (frontend): `http://localhost:8080/api`

## API Endpoints

| Prefix | Description |
|---|---|
| `/api/auth/*` | Login, register, password recovery, admin registration |
| `/api/clientes/*` | Client CRUD |
| `/api/empleados/*` | Employee management |
| `/api/roles/*` | Role management |
| `/api/logs/*` | System logs |

## API Testing

Bruno API collections are stored in [BrunoApis/](BrunoApis/). Use Bruno to test endpoints locally.
