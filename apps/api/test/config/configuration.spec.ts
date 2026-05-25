import configuration from '../../src/config/configuration';

describe('configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {};
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('uses development defaults when environment variables are not set', () => {
    expect(configuration()).toEqual({
      corsOrigins: ['http://localhost:5173'],
      databaseUrl: '',
      nodeEnv: 'development',
      port: 3001,
    });
  });

  it('parses comma-separated CORS origins', () => {
    process.env.CORS_ORIGINS = 'http://localhost:5173,http://localhost:4173';

    expect(configuration().corsOrigins).toEqual(['http://localhost:5173', 'http://localhost:4173']);
  });

  it('strips trailing slashes from CORS origins', () => {
    process.env.CORS_ORIGINS = 'https://blackhr.vercel.app/,https://preview.vercel.app';

    expect(configuration().corsOrigins).toEqual([
      'https://blackhr.vercel.app',
      'https://preview.vercel.app',
    ]);
  });
});
