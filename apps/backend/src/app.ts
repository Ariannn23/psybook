import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env";
import { swaggerDocs } from "./config/swagger";
import { errorMiddleware } from "./middlewares/error.middleware";
import { logger } from "./utils/logger";

import authRoutes from "./modules/auth/auth.routes";
import patientRoutes from "./modules/patients/patients.routes";
import serviceRoutes from "./modules/services/services.routes";
import scheduleRoutes from "./modules/schedules/schedules.routes";
import appointmentsRoutes from "./modules/appointments/appointments.routes";
import medicalRecordsRoutes from "./modules/medical-records/medical-records.routes";
import userRoutes from "./modules/users/users.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import notificationRoutes from "./modules/notifications/notifications.routes";
import publicRoutes from "./modules/public/public.routes";
import { rateLimiter } from "./middlewares/rate-limit.middleware";

const app = express();

app.set("trust proxy", env.TRUST_PROXY ? 1 : false);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (env.FRONTEND_URL.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

swaggerDocs(app);

const apiRouter = express.Router();

apiRouter.use("/public", rateLimiter(15 * 60 * 1000, 100), publicRoutes);

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/patients", patientRoutes);
apiRouter.use("/services", serviceRoutes);
apiRouter.use("/schedules", scheduleRoutes);
apiRouter.use("/appointments", appointmentsRoutes);
apiRouter.use("/medical-records", medicalRecordsRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/notifications", notificationRoutes);

app.use("/api", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "PsyBook API", version: "1.0.0" });
});

app.use(errorMiddleware);

export default app;
