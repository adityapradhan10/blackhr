import { NestFactory } from '@nestjs/core';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { bootstrap, startIfMain } from '../src/main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    build: jest.fn().mockReturnValue({ title: 'BlackHR API' }),
    setDescription: jest.fn().mockReturnThis(),
    setTitle: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
  })),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({ openapi: '3.0.0' }),
    setup: jest.fn(),
  },
}));

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts the Nest app on the configured port', async () => {
    const get = jest.fn().mockReturnValue({ get: jest.fn().mockReturnValue(3001) });
    const listen = jest.fn();
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    jest.mocked(NestFactory.create).mockResolvedValue({
      get,
      listen,
      setGlobalPrefix,
      useGlobalPipes,
    } as unknown as INestApplication);

    await bootstrap(4000);

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api/docs', expect.anything(), {
      openapi: '3.0.0',
    });
    expect(listen).toHaveBeenCalledWith(4000);
  });

  it('starts automatically when the current module is the entrypoint', async () => {
    const configGet = jest.fn().mockReturnValue(3001);
    const get = jest.fn().mockReturnValue({ get: configGet });
    const listen = jest.fn();
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    const currentModule = {} as NodeJS.Module;
    jest.mocked(NestFactory.create).mockResolvedValue({
      get,
      listen,
      setGlobalPrefix,
      useGlobalPipes,
    } as unknown as INestApplication);

    startIfMain(currentModule, currentModule);
    await Promise.resolve();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(get).toHaveBeenCalledWith(ConfigService);
    expect(configGet).toHaveBeenCalledWith('port', { infer: true });
    expect(listen).toHaveBeenCalledWith(3001);
  });

  it('does not start automatically when imported by another module', () => {
    startIfMain({} as NodeJS.Module, {} as NodeJS.Module);

    expect(NestFactory.create).not.toHaveBeenCalled();
  });
});
