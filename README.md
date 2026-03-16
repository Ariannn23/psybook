# PsyBook

## Descripción General

PsyBook es un sistema integral de gestión para profesionales de la psicología, diseñado para optimizar el flujo de trabajo clínico y administrativo. La plataforma permite la gestión centralizada de pacientes, citas, historias clínicas y recordatorios automáticos, facilitando la organización del consultorio y mejorando el seguimiento de los tratamientos. El sistema resuelve problemas de fragmentación de información, olvidos en la programación de citas y falta de digitalización en registros clínicos. Está dirigido a psicólogos independientes y clínicas de salud mental. Actualmente, el proyecto se encuentra en estado de desarrollo activo (fase beta).

## Características Principales

- Gestión de Usuarios: Sistema de autenticación y roles (ADMIN, PSYCHOLOGIST).
- Control de Pacientes: Registro detallado de pacientes con historial de contacto y notas.
- Agendamiento de Citas: Sistema de reserva de citas con validación de disponibilidad y estados (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA).
- Historias Clínicas: Registro digital de sesiones, evolución del paciente y posibilidad de adjuntar documentos.
- Panel de Control (Dashboard): Visualización de métricas clave, próximas citas y alertas de notificaciones.
- Configuración de Horarios: Gestión flexible de disponibilidad horaria por profesional.
- Servicios Personalizados: Definición de tipos de consulta, duraciones y precios.
- Notificaciones: Sistema interno de alertas y envío de correos electrónicos informativos.
- Reservas Públicas: Página externa para que los pacientes puedan solicitar citas directamente.

## Tecnologías Utilizadas

### Frontend

- Framework: React 19.2.0
- Herramienta de Construcción: Vite 7.3.1
- Gestión de Rutas: React Router DOM 7.13.0
- Formularios: React Hook Form 7.71.1
- Validación: Zod 3.24.1
- Estilos: Tailwind CSS 4.2.0
- Iconografía: Lucide React 0.574.0
- Visualización de Datos: Recharts 3.7.0

### Backend

- Lenguaje: TypeScript 5.3.3
- Entorno de Ejecución: Node.js (>=18.0.0)
- Framework: Express 4.18.3
- ORM: Prisma 5.10.0
- Seguridad: JWT (jsonwebtoken 9.0.2), BcryptJS 2.4.3, Helmet 7.1.0
- Documentación: Swagger UI Express 5.0.0

### Base de Datos

- Motor: PostgreSQL (Alojado en Supabase)

### Herramientas y Otros

- Gestión de Monorepositorio: npm Workspaces
- Notificaciones por Email: Resend / Nodemailer
- Calidad de Código: ESLint, Prettier
- Programación de Tareas: Node-cron 3.0.3

## Prerrequisitos

- Node.js versión 18.0.0 o superior.
- npm (gestor de paquetes de Node).
- Instancia de PostgreSQL (local o remota como Supabase).
- Cuenta en Resend (opcional para el servicio de correos).

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone [url-del-repo]
cd psybook
```

### 2. Variables de entorno

El proyecto utiliza un sistema de monorepositorio con archivos .env tanto en el backend como en el frontend.

**Backend (apps/backend/.env)**

| Variable       | Descripción                        | Ejemplo                             | Requerida |
| :------------- | :---------------------------------- | :---------------------------------- | :-------- |
| DATABASE_URL   | URL de conexión a PostgreSQL       | postgresql://user:pass@host:5432/db | Sí       |
| DIRECT_URL     | URL directa para migraciones Prisma | postgresql://user:pass@host:5432/db | Sí       |
| JWT_SECRET     | Secreto para firma de tokens JWT    | cadena_secreta_pro                  | Sí       |
| PORT           | Puerto de ejecución del servidor   | 4001                                | Sí       |
| MAIL_USER      | Usuario para servicio SMTP          | usuario@gmail.com                   | No        |
| MAIL_PASS      | Contraseña o App Key SMTP          | password_app                        | No        |
| FRONTEND_URL   | URL del origen frontend para CORS   | http://localhost:5173               | Sí       |
| RESEND_API_KEY | API Key para servicio Resend        | re_123456789                        | No        |

**Frontend (apps/frontend/.env)**

| Variable     | Descripción               | Ejemplo                   | Requerida |
| :----------- | :------------------------- | :------------------------ | :-------- |
| VITE_API_URL | URL base de la API backend | http://localhost:4001/api | Sí       |

### 3. Instalación de dependencias

Desde la raíz del proyecto, ejecutar:

```bash
npm install
```

### 4. Configuración de base de datos

Instalar y generar el cliente de Prisma:

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. Configuración adicional

Si se requiere sembrar datos iniciales:

```bash
npx ts-node seed-service.ts
```

## Ejecución del Proyecto

### Entorno de desarrollo

Para levantar tanto el backend como el frontend simultáneamente desde la raíz:

```bash
npm run dev
```

O de forma individual:

```bash
# Solo backend
npm run dev:backend

# Solo frontend
cd apps/frontend && npm run dev
```

### Comandos disponibles

Desde la raíz del proyecto:

| Comando               | Descripción                                   |
| :-------------------- | :--------------------------------------------- |
| npm run dev           | Inicia backend y frontend en modo desarrollo   |
| npm run build         | Compila el backend y frontend para producción |
| npm run build:backend | Compila únicamente el backend                 |
| npm run start         | Inicia el servidor backend compilado           |

## Estructura del Proyecto

```
psybook/
├── apps/
│   ├── backend/          # Servidor Node.js + Express
│   │   ├── prisma/       # Esquemas y migraciones de base de datos
│   │   ├── src/
│   │   │   ├── config/   # Configuraciones globales
│   │   │   ├── modules/  # Lógica de negocio organizada por dominios
│   │   │   └── server.ts # Punto de entrada
│   │   └── uploads/      # Almacenamiento local de archivos
│   └── frontend/         # SPA con React + Vite
│       ├── src/
│       │   ├── api/      # Clientes de servicios API
│       │   ├── components/# Componentes UI reutilizables
│       │   └── pages/    # Vistas principales del sistema
├── packages/
│   └── shared-types/     # Tipos TypeScript comunes para monorepo
└── package.json          # Configuración de npm workspaces
```

## Arquitectura y Decisiones Técnicas

- Estructura Monolítica Modular: El backend está organizado en módulos por dominio (auth, patients, appointments), lo que facilita la mantenibilidad y escalabilidad interna.
- Monorepositorio: Uso de npm Workspaces para gestionar frontend y backend en un único repositorio, compartiendo tipos y configuraciones.
- Validación de Esquemas: Uso intensivo de Zod tanto en frontend como en backend para garantizar la integridad de los datos.
- Seguridad: Implementación de Middlewares para autenticación JWT y control de acceso basado en roles (RBAC).

## Endpoints de la API

| Método | Ruta               | Descripción                        | Autenticación    |
| :------ | :----------------- | :---------------------------------- | :---------------- |
| POST    | /api/auth/login    | Inicio de sesión de usuario        | No                |
| POST    | /api/auth/register | Registro de nuevo profesional       | No                |
| GET     | /api/patients      | Listado de todos los pacientes      | Sí               |
| POST    | /api/appointments  | Creación de nueva cita             | Sí/No (Público) |
| GET     | /api/services      | Listado de servicios ofrecidos      | Sí               |
| GET     | /api/dashboard     | Estadísticas generales del sistema | Sí               |

## Flujo de Trabajo Git

- Ramas: main para producción, develop para integración de características.
- Commits: Se recomienda seguir la convención de Conventional Commits (feat:, fix:, chore:, docs:).

## Despliegue a Producción

### Checklist previo al despliegue

- Configurar variables de entorno de producción en el host.
- Asegurar que la base de datos PostgreSQL sea accesible.
- Ejecutar compilación de assets (build).
- Validar conectividad con el servicio de correo.

### Proceso de despliegue

1. Configurar aplicación en plataforma (ej. Vercel para frontend, Render/VPS para backend).
2. Definir variables de entorno en la plataforma.
3. El frontend utiliza el comando `npm run build` para generar el directorio `dist`.
4. El backend utiliza `npm run build` para generar archivos JS en `dist` y se inicia con `npm run start`.
5. Ejecutar migraciones en la base de datos de producción mediante `npx prisma migrate deploy`.

## Roadmap

### Corto plazo

- Implementación de recordatorios automáticos por WhatsApp.
- Mejora en la visualización de calendarios semanales.

### Mediano plazo

- Módulo de facturación y cobro online.
- Aplicación móvil dedicada para pacientes.

### Largo plazo

- Integración con plataformas de videollamada para telepsicología.
- Análisis predictivo de evolución del paciente mediante IA.

## Solución de Problemas Comunes

| Error                 | Causa                            | Solución                      |
| :-------------------- | :------------------------------- | :----------------------------- |
| Error de conexión DB | URL de base de datos incorrecta  | Verificar DATABASE_URL en .env |
| JWT Expired           | El token del usuario ha caducado | Re-autenticarse en el sistema  |
| Prisma Client Error   | Esquema no sincronizado          | Ejecutar npx prisma generate   |

## Licencia

Este proyecto está bajo la Licencia MIT.

## Autores

Desarrollado por el equipo de Sharcorp.
