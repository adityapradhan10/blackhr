import 'dotenv/config';
import type { Prisma } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import { BATCH_SIZE, SEED_EMPLOYEE_COUNT } from './constants';
import { EmployeeGenerator } from './employee-generator';

export type SeedPrismaClient = {
  employee: {
    createMany(args: { data: Prisma.EmployeeCreateManyInput[] }): Promise<{ count: number }>;
    deleteMany(): Promise<{ count: number }>;
  };
};

export type SeedGenerator = {
  generateEmployees(count: number, offset?: number): Prisma.EmployeeCreateManyInput[];
};

export type SeedEmployeesOptions = {
  prisma: SeedPrismaClient;
  generator: SeedGenerator;
  employeeCount?: number;
  batchSize?: number;
};

export async function seedEmployees({
  batchSize = BATCH_SIZE,
  employeeCount = SEED_EMPLOYEE_COUNT,
  generator,
  prisma,
}: SeedEmployeesOptions): Promise<number> {
  let insertedCount = 0;

  await prisma.employee.deleteMany();

  for (let offset = 0; offset < employeeCount; offset += batchSize) {
    const currentBatchSize = Math.min(batchSize, employeeCount - offset);
    const employees = generator.generateEmployees(currentBatchSize, offset);
    const result = await prisma.employee.createMany({ data: employees });

    insertedCount += result.count;
  }

  return insertedCount;
}

function createPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: databaseUrl,
    }),
  });
}

async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    const insertedCount = await seedEmployees({
      generator: new EmployeeGenerator(),
      prisma,
    });

    console.log(`Seeded ${insertedCount} employees`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  void main().catch((error: unknown) => {
    console.error('Seed failed');
    console.error(error);
    process.exitCode = 1;
  });
}
