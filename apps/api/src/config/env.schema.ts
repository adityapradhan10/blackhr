import 'reflect-metadata';
import { plainToInstance, Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min, validateSync } from 'class-validator';

const nodeEnvironments = ['development', 'test', 'production'] as const;

export type NodeEnvironment = (typeof nodeEnvironments)[number];

class EnvironmentVariables {
  @Transform(({ value }) => Number(value ?? 3001))
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3001;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL = '';

  @IsIn(nodeEnvironments)
  NODE_ENV: NodeEnvironment = 'development';
}

export function validateEnvironment(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    forbidNonWhitelisted: false,
    skipMissingProperties: false,
    whitelist: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
