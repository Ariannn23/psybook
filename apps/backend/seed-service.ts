import { PrismaClient } from "@prisma/client";
import { logger } from "./src/utils/logger";

const prisma = new PrismaClient();

async function main() {
  const service = await prisma.service.findFirst();
  if (service) {
    logger.info(service.id);
  } else {
    logger.info("NO_SERVICE_FOUND");
  }
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
