# 🚀 Guía de Inicio - PsyBook

Esta guía te ayudará a levantar el proyecto **PsyBook** en tu entorno local.

## 📋 Prerrequisitos

Asegúrate de tener instalado:

1.  **Node.js** (v18 o superior)
2.  **npm** (incluido con Node)
3.  **Git**
4.  **Base de Datos PostgreSQL** (o acceso a una instancia remota como Supabase/Neon).

---

## 🛠️ 1. Instalación de Dependencias

Este proyecto usa **Workspaces** de npm. Para instalar todas las dependencias (frontend y backend) ejecutando un solo comando en la raíz:

```bash
npm install
```

---

## ⚙️ 2. Configuración de Variables de Entorno

Necesitas configurar las variables de entorno para el Backend y el Frontend.

### Backend (`apps/backend`)

1.  Ve a la carpeta del backend: `cd apps/backend`
2.  Crea un archivo `.env` (puedes basarte en `.env.example` si existe, o usar este ejemplo):

```ini
# Puerto del servidor (Importante: usar 4001 para evitar conflictos)
PORT=4001

# URL de la base de datos (PostgreSQL connection string)
DATABASE_URL="postgresql://usuario:password@host:5432/nombre_db"

# Secreto para firmar tokens JWT (puede ser cualquier string largo)
JWT_SECRET="super_secreto_psybook_dev"

# Configuración de Email (Opcional por ahora)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_password_aplicacion

# URL del Frontend (para CORS)
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`apps/frontend`)

1.  Ve a la carpeta del frontend: `cd apps/frontend`
2.  Crea un archivo `.env`:

```ini
# URL de la API del Backend (debe coincidir con el puerto del backend)
VITE_API_URL="http://localhost:4001/api"
```

---

## 🗄️ 3. Configuración de Base de Datos

Una vez configurado el `DATABASE_URL` en el backend:

1.  Ve a la carpeta del backend:
    ```bash
    cd apps/backend
    ```
2.  Ejecuta las migraciones para crear las tablas:

    ```bash
    npx prisma migrate dev --name init
    ```

    _(Esto creará las tablas User, Patient, Appointment, etc.)_

3.  (Opcional) Abrir Prisma Studio para ver los datos:
    ```bash
    npx prisma studio
    ```

---

## ▶️ 4. Ejecutar el Proyecto

Necesitarás **dos terminales** abiertas.

### Terminal 1: Backend

Desde la raíz del proyecto:

```bash
npm run dev:backend
```

_O manualmente:_ `cd apps/backend && npm run dev`
_Debe indicar: "PsyBook Backend running on port 4001"_

### Terminal 2: Frontend

Desde la raíz del proyecto:

```bash
cd apps/frontend
npm run dev
```

_Debe indicar: "Local: http://localhost:5173"_

---

## ✅ Verificación

1.  Abre tu navegador en `http://localhost:5173`.
2.  Deberías ver la pantalla de Login.
3.  Si no tienes cuenta, haz clic en **"Sign Up"** para registrarte.
4.  Crea un paciente y verifica que se guarde.

¡Listo! 🚀
