'use strict';

const { execSync } = require('node:child_process');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: databaseUrl,
    }),
  });

  try {
    const count = await prisma.employee.count();

    if (count > 0) {
      console.log(`Database already seeded (${count} employees).`);
      return;
    }

    console.log('Database empty, seeding employees...');
    execSync('node prisma/seed/dist/seed.js', { stdio: 'inherit' });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Startup seed check failed');
  console.error(error);
  process.exit(1);
});
