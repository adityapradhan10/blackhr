type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

export function wildcardToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  const regexSource = `^${escaped.replace(/\*/g, '[^/]*')}$`;

  return new RegExp(regexSource);
}

export function isOriginAllowed(origin: string, allowedOrigins: readonly string[]): boolean {
  return allowedOrigins.some((allowed) => {
    if (allowed.includes('*')) {
      return wildcardToRegExp(allowed).test(origin);
    }

    return allowed === origin;
  });
}

export function createCorsOriginDelegate(
  allowedOrigins: readonly string[],
): (origin: string | undefined, callback: CorsOriginCallback) => void {
  return (origin, callback) => {
    if (!origin || isOriginAllowed(origin, allowedOrigins)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  };
}
