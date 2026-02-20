import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "doctor@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name: "Dr. Strange",
        role: "PSYCHOLOGIST", // Changed from PSYCHOLOGIST to whatever enum is defined
      },
    });
    console.log("User created:", user);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
