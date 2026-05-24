export const cookieStorageAdapter = {
  getItem(key: string): string | null {
    const cookie = globalThis.document?.cookie
      .split('; ')
      .find((item) => item.startsWith(`${encodeURIComponent(key)}=`));

    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
  },

  removeItem(key: string): void {
    globalThis.document.cookie = `${encodeURIComponent(key)}=; Max-Age=0; path=/`;
  },

  setItem(key: string, value: string): void {
    globalThis.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=/`;
  },
};
