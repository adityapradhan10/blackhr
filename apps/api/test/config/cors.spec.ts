import { createCorsOriginDelegate, isOriginAllowed, wildcardToRegExp } from '../../src/config/cors';

describe('cors origin matching', () => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://*.vercel.app',
    'https://blackhr-*-aditya-pradhans-projects.vercel.app',
  ];

  it('matches exact origins', () => {
    expect(isOriginAllowed('http://localhost:5173', allowedOrigins)).toBe(true);
  });

  it('matches wildcard Vercel preview origins', () => {
    expect(
      isOriginAllowed('https://blackhr-cayod06d8-aditya-pradhans-projects.vercel.app', allowedOrigins),
    ).toBe(true);
    expect(
      isOriginAllowed('https://blackhr-53y51tici-aditya-pradhans-projects.vercel.app', allowedOrigins),
    ).toBe(true);
  });

  it('rejects unknown origins', () => {
    expect(isOriginAllowed('https://evil.example.com', allowedOrigins)).toBe(false);
  });

  it('allows missing origin for non-browser requests', () => {
    const delegate = createCorsOriginDelegate(allowedOrigins);
    const callback = jest.fn();

    delegate(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('builds wildcard regex patterns', () => {
    expect(wildcardToRegExp('https://*.vercel.app').test('https://blackhr.vercel.app')).toBe(true);
    expect(wildcardToRegExp('https://*.vercel.app').test('https://evil.vercel.app.evil.com')).toBe(
      false,
    );
  });
});
