import { validateEnvironment } from '../../src/config/env.schema';

describe('validateEnvironment', () => {
  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: '',
        NODE_ENV: 'development',
        PORT: '70000',
      }),
    ).toThrow('PORT');
  });
});
