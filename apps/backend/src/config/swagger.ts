import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const serverUrl = (() => {
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:${process.env.PORT || 4001}`;
  }
  return undefined;
})();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PsyBook API",
      version: "1.0.0",
      description:
        "REST API para la plataforma SaaS de agendamiento psicológico PsyBook",
      contact: {
        name: "PsyBook Team",
      },
    },
    ...(serverUrl
      ? { servers: [{ url: serverUrl, description: "API server" }] }
      : {}),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function swaggerDocs(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
