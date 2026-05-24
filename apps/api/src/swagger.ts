import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BlackHR API')
    .setDescription('Backend API for BlackHR')
    .setVersion('1.0')
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}

export function setupSwagger(app: INestApplication): void {
  SwaggerModule.setup('api/docs', app, createSwaggerDocument(app));
}
