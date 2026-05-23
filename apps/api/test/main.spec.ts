import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { bootstrap, startIfMain } from '../src/main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts the Nest app on the configured port', async () => {
    const listen = jest.fn();
    jest.mocked(NestFactory.create).mockResolvedValue({
      listen,
    } as unknown as INestApplication);

    await bootstrap(4000);

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(listen).toHaveBeenCalledWith(4000);
  });

  it('starts automatically when the current module is the entrypoint', async () => {
    const listen = jest.fn();
    const currentModule = {} as NodeJS.Module;
    jest.mocked(NestFactory.create).mockResolvedValue({
      listen,
    } as unknown as INestApplication);

    startIfMain(currentModule, currentModule);
    await Promise.resolve();

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);
    expect(listen).toHaveBeenCalledWith(3000);
  });

  it('does not start automatically when imported by another module', () => {
    startIfMain({} as NodeJS.Module, {} as NodeJS.Module);

    expect(NestFactory.create).not.toHaveBeenCalled();
  });
});
