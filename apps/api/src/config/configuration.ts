import type { NodeEnvironment } from './env.schema';

export type AppConfiguration = {
  port: number;
  databaseUrl: string;
  nodeEnv: NodeEnvironment;
  corsOrigins: string[];
};

export default function configuration(): AppConfiguration {
  return {
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    databaseUrl: process.env.DATABASE_URL ?? '',
    nodeEnv: (process.env.NODE_ENV ?? 'development') as NodeEnvironment,
    port: Number(process.env.PORT ?? 3001),
  };
}
