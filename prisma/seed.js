import prisma from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'admin@campus.com';
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: passwordHash,
      role: 'ADMIN',
      name: 'Admin',
    },
  });

  console.log('✅ Seeded admin: admin@campus.com / admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
