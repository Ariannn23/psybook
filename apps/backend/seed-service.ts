import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const service = await prisma.service.findFirst();
  if (service) {
    console.log(service.id);
  } else {
    console.log("NO_SERVICE_FOUND");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
