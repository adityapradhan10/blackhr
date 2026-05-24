export const sessionStorageAdapter = {
  getItem(key: string): string | null {
    return globalThis.sessionStorage?.getItem(key) ?? null;
  },

  removeItem(key: string): void {
    globalThis.sessionStorage?.removeItem(key);
  },

  setItem(key: string, value: string): void {
    globalThis.sessionStorage?.setItem(key, value);
  },
};
