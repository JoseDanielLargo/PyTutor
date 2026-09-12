import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

/**
 * A "seed" script inserts starter data into the database. Here we create the
 * first ADMIN account (you). Run it with:  npm run prisma:seed
 *
 * The password is read from the SEED_ADMIN_PASSWORD environment variable so it
 * is never hardcoded in the repo. We store only the bcrypt HASH, never the
 * raw password. Running it again just updates the existing user (idempotent).
 */
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'joselargosan@gmail.com';
  const name = process.env.SEED_ADMIN_NAME ?? 'Jose Largo';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      'Set SEED_ADMIN_PASSWORD before seeding, e.g.\n' +
        '  SEED_ADMIN_PASSWORD="your-temp-password" npm run prisma:seed',
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role: Role.ADMIN },
    create: { email, name, passwordHash, role: Role.ADMIN },
  });

  console.log(`✅ Admin user ready: ${user.email} (role: ${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$destroy?.();
    await prisma.$disconnect();
  });
