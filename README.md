# BankPulse

Aplicación de pagos — esqueleto ejecutable del **Sprint 1**.

- **Backend:** Node.js + Express (API REST, patrón MVC)
- **Frontend:** React + Vite (patrón MVC con hooks), servido por Nginx
- **Base de datos:** PostgreSQL 16
- **Orquestación:** Docker Compose

---

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose v2
- (Opcional, para desarrollo local sin Docker) Node.js 20+

## Puesta en marcha con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu-usuario>/bankpulse.git
cd bankpulse

# 2. Crear el archivo de entorno a partir de la plantilla y editar las credenciales
cp .env.example .env

# 3. Construir y levantar todos los servicios
docker compose up --build -d
```

| Servicio  | URL                           |
|-----------|-------------------------------|
| Frontend  | http://localhost:8080         |
| Backend   | http://localhost:3000         |
| Health    | http://localhost:3000/health  |
| PostgreSQL| interno a la red de Docker (`db:5432`) |

### Orden de arranque

La aplicación **espera a que la base de datos esté disponible** antes de arrancar, en dos niveles:

1. `docker-compose.yml` define un `healthcheck` con `pg_isready` en el servicio `db`, y el `backend` usa `depends_on: condition: service_healthy`. El `frontend` a su vez espera a que el `backend` esté sano (`/health`).
2. El propio backend (`backend/src/config/db.js`) reintenta la conexión a PostgreSQL varias veces antes de abrir el puerto HTTP, por si la base de datos se reinicia.

### Comandos Docker útiles

```bash
docker compose up --build -d      # construir y levantar en segundo plano
docker compose ps                 # estado de los contenedores (y su salud)
docker compose logs -f backend    # ver logs del backend
docker compose down               # detener los servicios
docker compose down -v            # detener y borrar el volumen de la base de datos
docker compose exec db psql -U bankpulse -d bankpulse   # consola SQL
```

## API

| Método | Ruta              | Descripción                         | Respuesta |
|--------|-------------------|-------------------------------------|-----------|
| GET    | `/health`         | Estado de la API y de la BD         | `200 OK`  |
| POST   | `/api/pagos`      | Registra un pago (simulado)         | `201 Created` / `400 Bad Request` |
| GET    | `/api/pagos`      | Lista los pagos                     | `200 OK`  |
| GET    | `/api/pagos/:id`  | Obtiene un pago por id              | `200 OK` / `404 Not Found` |

### Health check

`GET /health` siempre responde **HTTP 200** mientras la API esté viva, e informa del estado de la base de datos:

```json
{
  "status": "UP",
  "service": "bankpulse-backend",
  "version": "1.0.0",
  "database": "UP",
  "uptimeSeconds": 42,
  "timestamp": "2026-10-05T12:00:00.000Z"
}
```

Docker Compose usa este endpoint como `healthcheck` del backend, y el frontend no arranca hasta que el backend está sano.

### Ejemplos

```bash
curl -i http://localhost:3000/health

curl -i -X POST http://localhost:3000/api/pagos \
  -H "Content-Type: application/json" \
  -d '{"emisor":"ana","receptor":"luis","monto":150.50,"moneda":"USD"}'

curl http://localhost:3000/api/pagos
```

Respuesta de `POST /api/pagos`:

```json
{
  "id": 1,
  "emisor": "ana",
  "receptor": "luis",
  "monto": 150.5,
  "moneda": "USD",
  "estado": "COMPLETADO",
  "creadoEn": "2026-10-05T12:00:00.000Z"
}
```

## Arquitectura MVC

```
bankpulse/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   └── src/
│       ├── server.js              # arranque: espera a la BD, crea tablas, abre el puerto
│       ├── app.js                 # configuración de Express y registro de rutas
│       ├── config/db.js           # pool de PostgreSQL + reintentos de conexión
│       ├── models/pagoModel.js    # MODELO: tabla `pagos`, validación y consultas SQL
│       ├── views/pagoView.js      # VISTA: formato JSON de salida de un pago
│       ├── controllers/           # CONTROLADOR: lógica de cada petición HTTP
│       │   ├── healthController.js
│       │   └── pagoController.js
│       └── routes/                # mapeo URL → controlador
│           ├── healthRoutes.js
│           └── pagoRoutes.js
└── frontend/
    ├── Dockerfile                 # build con Vite + servido con Nginx
    ├── nginx.conf                 # proxy de /api y /health hacia el backend
    └── src/
        ├── models/pagoModel.js            # MODELO: llamadas a la API REST
        ├── controllers/usePagosController.js  # CONTROLADOR: estado y acciones (hook)
        ├── views/                         # VISTA: componentes de presentación
        │   ├── HealthBadge.jsx
        │   ├── PagoForm.jsx
        │   └── PagoList.jsx
        └── App.jsx                        # compone controlador + vistas
```

**Backend.** Una petición `POST /api/pagos` entra por `routes/pagoRoutes.js`, que la delega a `controllers/pagoController.js`. El controlador valida y persiste mediante `models/pagoModel.js` (único lugar con SQL) y responde usando `views/pagoView.js`, que decide qué campos y con qué formato se devuelven.

**Frontend.** Los componentes en `views/` solo reciben props y renderizan. El hook `usePagosController` mantiene el estado (lista de pagos, errores, salud de la API) y expone acciones como `crearPago`. Este hook usa `models/pagoModel.js`, que encapsula todas las llamadas `fetch`.

## Desarrollo local sin Docker

```bash
# Base de datos (solo el contenedor de PostgreSQL)
docker compose up -d db

# Backend
cd backend
npm install
DB_HOST=localhost DB_USER=bankpulse DB_PASSWORD=... DB_NAME=bankpulse npm run dev
# Nota: para acceder a la BD desde el host, publica el puerto 5432 en docker-compose.yml

# Frontend (en otra terminal). Vite redirige /api y /health a localhost:3000
cd frontend
npm install
npm run dev     # http://localhost:5173
```

## Variables de entorno

Ver [`.env.example`](.env.example). El archivo `.env` real está en `.gitignore` y **nunca** debe subirse al repositorio.
