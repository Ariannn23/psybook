# STACK OFICIAL

## Frontend

* React
* TypeScript
* Tailwind CSS
* ShadCN UI
* React Hook Form
* Zod
* Axios
* React Router
* Zustand
* FullCalendar

## Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT
* Bcrypt
* Nodemailer
* Zod
* Helmet
* CORS

# ARQUITECTURA PRO

<pre class="overflow-visible! px-0!" data-start="651" data-end="811"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monorepo/
 ├─ apps/
 │   ├─ frontend/
 │   └─ backend/
 ├─ packages/
 │   ├─ shared-types/
 │   └─ config/
 ├─ docker-compose.yml
 ├─ .env
 └─ README.md
</span></span></code></div></div></pre>

---

# ESTRUCTURA BACKEND PRO

<pre class="overflow-visible! px-0!" data-start="847" data-end="1332"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>backend/src
 ├─ config/
 │   ├─ db.ts
 │   ├─ env.ts
 │   └─ mail.ts
 ├─ modules/
 │   ├─ auth/
 │   │   ├─ auth.controller.ts
 │   │   ├─ auth.service.ts
 │   │   ├─ auth.routes.ts
 │   │   └─ auth.</span><span>schema</span><span>.ts
 │   ├─ users/
 │   ├─ patients/
 │   ├─ appointments/
 │   ├─ services/
 │   ├─ schedules/
 │   ├─ notifications/
 │   └─ dashboard/
 ├─ middlewares/
 │   ├─ auth.middleware.ts
 │   ├─ </span><span>role</span><span>.middleware.ts
 │   └─ error.middleware.ts
 ├─ utils/
 ├─ app.ts
 └─ </span><span>server</span><span>.ts
</span></span></code></div></div></pre>

---

# ESTRUCTURA FRONTEND PRO

<pre class="overflow-visible! px-0!" data-start="1369" data-end="1605"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>frontend/src
 ├─ api/
 ├─ components/
 ├─ layouts/
 ├─ pages/
 │   ├─ </span><span>public</span><span>/
 │   ├─ auth/
 │   ├─ </span><span>admin</span><span>/
 │   ├─ patient/
 │   └─ psychologist/
 ├─ hooks/
 ├─ store/
 ├─ </span><span>schemas</span><span>/
 ├─ routes/
 ├─ utils/
 ├─ App.tsx
 └─ main.tsx
</span></span></code></div></div></pre>

---

# PRISMA SCHEMA (BASE REAL)

<pre class="overflow-visible! px-0!" data-start="1644" data-end="2978"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-prisma"><span>model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
  schedules Schedule[]
  appointments Appointment[]
}

model Patient {
  id        String   @id @default(uuid())
  name      String
  email     String
  phone     String
  createdAt DateTime @default(now())
  appointments Appointment[]
}

model Service {
  id        String   @id @default(uuid())
  name      String
  duration  Int
  price     Float
  appointments Appointment[]
}

model Schedule {
  id        String   @id @default(uuid())
  userId    String
  day       Int
  startTime String
  endTime   String
  user      User @relation(fields: [userId], references: [id])
}

model Appointment {
  id         String   @id @default(uuid())
  patientId  String
  userId     String
  serviceId  String
  date       DateTime
  startTime  String
  endTime    String
  status     Status
  reason     String
  createdAt  DateTime @default(now())

  patient Patient @relation(fields: [patientId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
  service Service @relation(fields: [serviceId], references: [id])
}

enum Role {
  ADMIN
  PSYCHOLOGIST
}

enum Status {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}</span></code></div></div></pre>


# API ENDPOINTS BASE

## Auth

<pre class="overflow-visible! px-0!" data-start="3018" data-end="3082"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST   /auth/register
POST   /auth/login
GET    /auth/me
</span></span></code></div></div></pre>

## Patients

<pre class="overflow-visible! px-0!" data-start="3096" data-end="3200"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST   /patients
GET    /patients
GET    /patients/:</span><span>id</span><span>
PUT    /patients/:</span><span>id</span><span>
DELETE /patients/:</span><span>id</span><span>
</span></span></code></div></div></pre>

## Appointments

<pre class="overflow-visible! px-0!" data-start="3218" data-end="3342"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST   /appointments
GET    /appointments
GET    /appointments/:</span><span>id</span><span>
PUT    /appointments/:</span><span>id</span><span>
DELETE /appointments/:</span><span>id</span><span>
</span></span></code></div></div></pre>

## Services

<pre class="overflow-visible! px-0!" data-start="3356" data-end="3439"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST   /services
GET    /services
PUT    /services/:</span><span>id</span><span>
DELETE /services/:</span><span>id</span><span>
</span></span></code></div></div></pre>

## Schedules

<pre class="overflow-visible! px-0!" data-start="3454" data-end="3497"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>POST   /schedules
GET    /schedules
</span></span></code></div></div></pre>

---

# AUTH FLOW PRO

<pre class="overflow-visible! px-0!" data-start="3524" data-end="3637"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Register → Hash </span><span>password</span><span> → JWT
</span><span>Login</span><span> → </span><span>Validate</span><span> → JWT
Request → Middleware auth → </span><span>role</span><span></span><span>check</span><span> → controller
</span></span></code></div></div></pre>

---

# EMAIL FLOW

<pre class="overflow-visible! px-0!" data-start="3661" data-end="3761"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Create</span><span> appointment →
Send email confirmation →
</span><span>24</span><span>h </span><span>before</span><span> → reminder →
Cancel → cancel email
</span></span></code></div></div></pre>

---

# DOCKER BASE

<pre class="overflow-visible! px-0!" data-start="3786" data-end="4080"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre! language-yaml"><span><span>version:</span><span></span><span>"3.8"</span><span>
</span><span>services:</span><span>
  </span><span>db:</span><span>
    </span><span>image:</span><span></span><span>postgres:15</span><span>
    </span><span>environment:</span><span>
      </span><span>POSTGRES_DB:</span><span></span><span>psycare</span><span>
      </span><span>POSTGRES_USER:</span><span></span><span>admin</span><span>
      </span><span>POSTGRES_PASSWORD:</span><span></span><span>admin</span><span>
    </span><span>ports:</span><span>
      </span><span>-</span><span></span><span>"5432:5432"</span><span>

  </span><span>backend:</span><span>
    </span><span>build:</span><span></span><span>./apps/backend</span><span>
    </span><span>ports:</span><span>
      </span><span>-</span><span></span><span>"4000:4000"</span><span>
    </span><span>depends_on:</span><span>
      </span><span>-</span><span></span><span>db</span><span>
</span></span></code></div></div></pre>

---

# ENV BASE

<pre class="overflow-visible! px-0!" data-start="4102" data-end="4274"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>DATABASE_URL</span><span>=postgresql://admin:admin@localhost:</span><span>5432</span><span>/psycare
</span><span>JWT_SECRET</span><span>=supersecretkey
</span><span>PORT</span><span>=</span><span>4000</span><span>
</span><span>MAIL_HOST</span><span>=smtp.gmail.com
</span><span>MAIL_USER</span><span>=example@gmail.com
</span><span>MAIL_PASS</span><span>=pass
</span></span></code></div></div></pre>

---

# ROADMAP PRO

### Sprint 1

* Auth
* Roles
* CRUD base
* DB
* API
* Docker

### Sprint 2

* Agenda visual
* Emails
* Panel admin
* Horarios

### Sprint 3

* Dashboard
* Analytics
* Pagos
* SaaS logic
* Multi-consultorio

# Wireframe lógico (estructura visual)

### Landing:

<pre class="overflow-visible! px-0!" data-start="1849" data-end="1941"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>[ Logo ]</span><span>
</span><span>[ Bienvenida ]</span><span>
</span><span>[ Info de la consulta ]</span><span>
</span><span>[ Servicios ]</span><span>
</span><span>[ Botón AGENDAR CITA ]</span><span>
</span></span></code></div></div></pre>

### Agendamiento:

<pre class="overflow-visible! px-0!" data-start="1961" data-end="2074"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>[ Seleccionar servicio ]</span><span>
</span><span>[ Calendario ]</span><span>
</span><span>[ Horas disponibles ]</span><span>
</span><span>[ Formulario paciente ]</span><span>
</span><span>[ Botón Confirmar ]</span><span>
</span></span></code></div></div></pre>

### Panel Admin:

<pre class="overflow-visible! px-0!" data-start="2093" data-end="2265"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>[ Sidebar ]
</span><span>  -</span><span> Dashboard
</span><span>  -</span><span> Agenda
</span><span>  -</span><span> Pacientes
</span><span>  -</span><span> Servicios
</span><span>  -</span><span> Psicólogos
</span><span>  -</span><span> Configuración

[ Vista principal ]
</span><span>  -</span><span> Calendario
</span><span>  -</span><span> Lista de citas
</span><span>  -</span><span> Filtros</span></span></code></div></div></pre>


# Flujo de usuarios

## Paciente

<pre class="overflow-visible! px-0!" data-start="1443" data-end="1629"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Landing →
Agendar cita →
Selecciona servicio →
Selecciona fecha →
Selecciona hora disponible →
Formulario datos →
Confirmación →
Email automático →
Recordatorio →
Asiste </span><span>a</span><span> sesión
</span></span></code></div></div></pre>

## Psicólogo/Admin

<pre class="overflow-visible! px-0!" data-start="1653" data-end="1787"><div class="contain-inline-size rounded-2xl corner-superellipse/1.1 relative bg-token-sidebar-surface-primary"><div class="sticky top-[calc(var(--sticky-padding-top)+9*var(--spacing))]"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>Login →
Panel →
Ver agenda →
Ver citas </span><span>del</span><span> dí</span><span>a</span><span> →
Confirmar/Cancelar →
Marcar como atendida →
Ver historial paciente →
Reportes</span></span></code></div></div></pre>
