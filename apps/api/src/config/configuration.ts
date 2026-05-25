import type { NodeEnvironment } from './env.schema';

export type AppConfiguration = {
  port: number;
  databaseUrl: string;
  nodeEnv: NodeEnvironment;
  corsOrigins: string[];
};

function parseCorsOrigins(value: string | undefined): string[] {
  return (value ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);
}

export default function configuration(): AppConfiguration {
  return {
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    databaseUrl: process.env.DATABASE_URL ?? '',
    nodeEnv: (process.env.NODE_ENV ?? 'development') as NodeEnvironment,
    port: Number(process.env.PORT ?? 3001),
  };
}
