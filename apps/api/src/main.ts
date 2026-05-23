import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function bootstrap(port = process.env.PORT ?? 3000) {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

export function startIfMain(currentModule: NodeJS.Module, mainModule = require.main) {
  if (mainModule !== currentModule) {
    return;
  }

  void bootstrap();
}

startIfMain(module);
