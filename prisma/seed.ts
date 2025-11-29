import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@email.com";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        username: "admin",
        role: "ADMIN",
      },
    });

    console.log("Admin criado com sucesso!");
  } else {
    console.log("Admin já existe.");
  }
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
