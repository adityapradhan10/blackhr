import { validateEnvironment } from '../../src/config/env.schema';

describe('validateEnvironment', () => {
  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'file:./test.db',
        NODE_ENV: 'development',
        PORT: '70000',
      }),
    ).toThrow('PORT');
  });

  it('rejects an empty database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: '',
        NODE_ENV: 'development',
        PORT: '3001',
      }),
    ).toThrow('DATABASE_URL');
  });
});
