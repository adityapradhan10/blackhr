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
  ApiBody: jest.fn(() => jest.fn()),
  ApiBadRequestResponse: jest.fn(() => jest.fn()),
  ApiConflictResponse: jest.fn(() => jest.fn()),
  ApiCreatedResponse: jest.fn(() => jest.fn()),
  ApiNotFoundResponse: jest.fn(() => jest.fn()),
  ApiOkResponse: jest.fn(() => jest.fn()),
  ApiParam: jest.fn(() => jest.fn()),
  ApiProperty: jest.fn(() => jest.fn()),
  ApiPropertyOptional: jest.fn(() => jest.fn()),
  ApiQuery: jest.fn(() => jest.fn()),
  ApiTags: jest.fn(() => jest.fn()),
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
  PartialType: jest.fn((BaseClass) => class extends BaseClass {}),
}));

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function createConfigGet(overrides: Partial<{ corsOrigins: string[]; port: number }> = {}) {
    return jest.fn((key: string) => {
      if (key === 'corsOrigins') {
        return overrides.corsOrigins ?? ['http://localhost:5173'];
      }

      if (key === 'port') {
        return overrides.port ?? 3001;
      }

      return undefined;
    });
  }

  it('starts the Nest app on the configured port', async () => {
    const configGet = createConfigGet();
    const get = jest.fn().mockReturnValue({ get: configGet });
    const listen = jest.fn();
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    const enableCors = jest.fn();
    jest.mocked(NestFactory.create).mockResolvedValue({
      enableCors,
      get,
      listen,
      setGlobalPrefix,
      useGlobalPipes,
    } as unknown as INestApplication);

    await bootstrap(4000);

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(setGlobalPrefix).toHaveBeenCalledWith('api/v1');
    expect(useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(enableCors).toHaveBeenCalledWith({ origin: ['http://localhost:5173'] });
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api/docs', expect.anything(), {
      openapi: '3.0.0',
    });
    expect(listen).toHaveBeenCalledWith(4000);
  });

  it('starts automatically when the current module is the entrypoint', async () => {
    const configGet = createConfigGet();
    const get = jest.fn().mockReturnValue({ get: configGet });
    const listen = jest.fn();
    const setGlobalPrefix = jest.fn();
    const useGlobalPipes = jest.fn();
    const enableCors = jest.fn();
    const currentModule = {} as NodeJS.Module;
    jest.mocked(NestFactory.create).mockResolvedValue({
      enableCors,
      get,
      listen,
      setGlobalPrefix,
      useGlobalPipes,
    } as unknown as INestApplication);

    startIfMain(currentModule, currentModule);
    await Promise.resolve();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(get).toHaveBeenCalledWith(ConfigService);
    expect(configGet).toHaveBeenCalledWith('corsOrigins', { infer: true });
    expect(configGet).toHaveBeenCalledWith('port', { infer: true });
    expect(enableCors).toHaveBeenCalledWith({ origin: ['http://localhost:5173'] });
    expect(listen).toHaveBeenCalledWith(3001);
  });

  it('does not start automatically when imported by another module', () => {
    startIfMain({} as NodeJS.Module, {} as NodeJS.Module);

    expect(NestFactory.create).not.toHaveBeenCalled();
  });
});
