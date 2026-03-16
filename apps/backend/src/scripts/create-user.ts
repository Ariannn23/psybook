import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL || process.argv[2];
  const password = process.env.SEED_USER_PASSWORD || process.argv[3];

  if (!email || !password) {
    throw new Error(
      "Missing credentials. Provide argv: create-user <email> <password> or env: SEED_USER_EMAIL/SEED_USER_PASSWORD",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name: "Dr. Strange",
        role: "PSYCHOLOGIST",
      },
    });
    logger.info("User created", { id: user.id, email: user.email, role: user.role });
  } catch (e) {
    logger.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
