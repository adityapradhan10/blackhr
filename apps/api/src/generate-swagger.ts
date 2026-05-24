import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createSwaggerDocument } from './swagger';

export async function generateSwagger(outputPath = '../../docs/openapi.json'): Promise<void> {
  process.env.DATABASE_URL ??= 'file:./swagger.db';

  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api/v1');

  const document = createSwaggerDocument(app);
  const resolvedOutputPath = resolve(process.cwd(), outputPath);
  await mkdir(dirname(resolvedOutputPath), { recursive: true });
  await writeFile(resolvedOutputPath, `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
}

if (require.main === module) {
  void generateSwagger(process.argv[2]).catch((error: unknown) => {
    console.error('Swagger generation failed');
    console.error(error);
    process.exitCode = 1;
  });
}
