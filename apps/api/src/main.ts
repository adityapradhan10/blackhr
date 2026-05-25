import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { AppConfiguration } from './config/configuration';
import { createCorsOriginDelegate } from './config/cors';
import { setupSwagger } from './swagger';

export async function bootstrap(port?: number) {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  setupSwagger(app);

  const configService = app.get(ConfigService<AppConfiguration, true>);
  app.enableCors({
    origin: createCorsOriginDelegate(configService.get('corsOrigins', { infer: true })),
  });

  await app.listen(port ?? configService.get('port', { infer: true }));
}

export function startIfMain(currentModule: NodeJS.Module, mainModule = require.main) {
  if (mainModule !== currentModule) {
    return;
  }

  void bootstrap();
}

startIfMain(module);
