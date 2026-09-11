# ContactsCode

API REST para gestionar una agenda de contactos, construida con [NestJS](https://nestjs.com/) y MySQL. Cada contacto pertenece a un usuario, que debe registrarse e iniciar sesión para obtener un token de acceso antes de poder usar los endpoints de contactos.

## Tecnologías

- **NestJS 11** + TypeScript
- **MySQL** (driver `mysql2`), acceso a datos con SQL plano (sin ORM)
- **class-validator** / **class-transformer** para validar los DTOs de entrada
- Autenticación con **JWT** propio (firmado con HMAC-SHA256, implementado a mano en `src/auth/jwt.ts`, sin depender de `@nestjs/jwt`)
- **Jest** + **Supertest** para pruebas unitarias y e2e

## Estructura del proyecto

```
src/
├── auth/                 # Registro, login, refresh de tokens y guard de autenticación
│   ├── dto/               # LoginDto, RegisterDto, RefreshDto
│   ├── entities/          # User
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts       # Valida el header Authorization: Bearer <token>
│   ├── current-user.decorator.ts
│   ├── jwt.ts              # sign()/verify() del token
│   └── users.repository.ts
├── contacts/              # CRUD de contactos
│   ├── dto/                # CreateContactDto, UpdateContactDto, ContactResponseDto
│   ├── entities/           # Contact
│   ├── contacts.controller.ts
│   ├── contacts.service.ts
│   └── contacts.repository.ts
├── database/
│   └── database.module.ts  # Pool de conexión a MySQL
├── app.module.ts
└── main.ts
db/
└── schema.sql             # Script de creación de las tablas users y contacts
```

## Requisitos previos

- Node.js 18+
- Un servidor **MySQL** corriendo localmente (puerto 3306)

## Instalación

```bash
git clone https://github.com/CamilaQuintanilla11/ContactsCode-.git
cd ContactsCode-
npm install
```

### Base de datos

1. Crea el esquema ejecutando el script incluido:

   ```bash
   mysql -u root < db/schema.sql
   ```

   Esto crea la base `agenda` con las tablas `users` y `contacts`.

2. La cadena de conexión está definida en `src/database/database.module.ts`:

   ```
   mysql://root@localhost:3306/agenda
   ```

   Ajusta ese valor si tu usuario, contraseña o host de MySQL son distintos (por ahora no se lee desde variables de entorno).

### Levantar el servidor

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000` (o en el puerto definido por la variable de entorno `PORT`).

## Autenticación

Todos los endpoints de `/contacts` requieren un token de acceso enviado en el header:

```
Authorization: Bearer <accessToken>
```

### `POST /auth/register`

Crea un usuario nuevo.

```json
{
  "email": "camila@example.com",
  "password": "minimo8caracteres"
}
```

Respuesta `201`: `{ "id": "...", "email": "..." }`. Devuelve `409 Conflict` si el email ya existe.

### `POST /auth/login`

```json
{
  "email": "camila@example.com",
  "password": "minimo8caracteres"
}
```

Respuesta `200`: `{ "accessToken": "...", "refreshToken": "..." }`. El `accessToken` expira a los 15 minutos y el `refreshToken` a los 7 días.

### `POST /auth/refresh`

```json
{
  "refreshToken": "..."
}
```

Respuesta `200`: `{ "accessToken": "..." }`.

## Endpoints de contactos

Requieren el header `Authorization` descrito arriba.

| Método | Ruta            | Descripción                          |
|--------|-----------------|---------------------------------------|
| POST   | `/contacts`     | Crea un contacto                      |
| GET    | `/contacts`     | Lista todos los contactos             |
| GET    | `/contacts/:id` | Obtiene un contacto por id            |
| PATCH  | `/contacts/:id` | Actualiza parcialmente un contacto    |
| DELETE | `/contacts/:id` | Elimina un contacto (`204` sin body)  |

### `POST /contacts`

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "phone": "+52 55 1234 5678",
  "notes": "Contacto de trabajo (opcional)"
}
```

`name`, `email` y `phone` son obligatorios (`phone` debe tener formato numérico, con `+` opcional al inicio). `notes` es opcional.

### Respuesta de un contacto

```json
{
  "id": "uuid",
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "phone": "+52 55 1234 5678",
  "notes": "Contacto de trabajo",
  "createdAt": "2026-09-11T12:00:00.000Z"
}
```

### `PATCH /contacts/:id`

Acepta cualquier subconjunto de los campos de creación (`name`, `email`, `phone`, `notes`).

## Scripts disponibles

```bash
npm run start        # Inicia la app
npm run start:dev    # Modo watch
npm run start:prod   # Ejecuta el build compilado (dist/main.js)
npm run build        # Compila con nest build
npm run lint         # ESLint con --fix
npm run format       # Prettier sobre src/ y test/
npm run test         # Pruebas unitarias (Jest)
npm run test:e2e     # Pruebas end-to-end
npm run test:cov     # Cobertura de pruebas
```

## Estado actual / pendientes

Este proyecto está en desarrollo. Algunos puntos a tener en cuenta o pendientes de mejorar:

- Los contactos no están filtrados por usuario propietario (`GET /contacts`, `GET /contacts/:id`, `PATCH` y `DELETE` operan sobre toda la tabla, no solo sobre los contactos del usuario autenticado).
- Las consultas SQL se construyen con interpolación de strings en lugar de parámetros preparados; falta sanitizar/parametrizar en `users.repository.ts` y `contacts.repository.ts`.
- La cadena de conexión a MySQL y el secreto usado para firmar los tokens están hardcodeados en el código en lugar de leerse desde variables de entorno.
- Las contraseñas se hashean con SHA-256 sin salt.
- La agenda tiene un límite fijo de 100 contactos (`contacts.repository.ts`).
