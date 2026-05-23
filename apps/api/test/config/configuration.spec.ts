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
      databaseUrl: '',
      nodeEnv: 'development',
      port: 3001,
    });
  });
});
