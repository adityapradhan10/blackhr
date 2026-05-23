import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import type { AppConfiguration } from './config/configuration';

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BlackHR API')
    .setDescription('Backend API for BlackHR')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const configService = app.get(ConfigService<AppConfiguration, true>);
  await app.listen(port ?? configService.get('port', { infer: true }));
}

export function startIfMain(currentModule: NodeJS.Module, mainModule = require.main) {
  if (mainModule !== currentModule) {
    return;
  }

  void bootstrap();
}

startIfMain(module);
