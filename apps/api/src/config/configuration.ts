import type { NodeEnvironment } from './env.schema';

export type AppConfiguration = {
  port: number;
  databaseUrl: string;
  nodeEnv: NodeEnvironment;
};

export default function configuration(): AppConfiguration {
  return {
    databaseUrl: process.env.DATABASE_URL ?? '',
    nodeEnv: (process.env.NODE_ENV ?? 'development') as NodeEnvironment,
    port: Number(process.env.PORT ?? 3001),
  };
}
