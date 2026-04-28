## 1. Estructura recomendada Angular

Dentro de `/frontend/spa-frontend/src/app/`:

```bash
app/

├── core/                  # servicios globales
│   ├── services/          # auth, api, etc.
│   └── guards/            # protección por roles
│
├── shared/                # componentes reutilizables
│   ├── components/
│   └── models/
│
├── features/              # módulos por funcionalidad
│   ├── auth/
│   ├── usuarios/
│   ├── clientes/
│   └── citas/
│
├── layouts/               # layouts (admin, login)
│
├── pages/                 # vistas principales
│
└── app-routing.module.ts
```

---

## 2. Cómo organizar Angular correctamente

### core/

- servicios globales (AuthService)
- interceptores HTTP (JWT)
- guards

---

### shared/

- componentes reutilizables
- modelos TypeScript

---

### features/

- cada módulo funcional:

  - auth
  - citas
  - mascotas

Cada uno con:

- components
- services
- routing

---

## 3. Flujo frontend

```text
Component → Service → HTTP → Backend API
```

---

## 4. Errores que debes evitar

### Frontend

- todo en un solo módulo
- lógica en componentes
- no usar servicios

---

## 5. Conclusión clara

Frontend:

- usa módulos por funcionalidad (features)
