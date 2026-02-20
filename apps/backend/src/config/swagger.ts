import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4001}`,
        description: "Development server",
      },
    ],
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.use(
    "/api/docs",
    swaggerUi.serve as any,
    swaggerUi.setup(swaggerSpec) as any,
  );
  app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log("📖 Swagger docs available at /api/docs");
}
