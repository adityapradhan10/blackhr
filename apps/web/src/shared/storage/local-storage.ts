export const localStorageAdapter = {
  getItem(key: string): string | null {
    return globalThis.localStorage?.getItem(key) ?? null;
  },

  removeItem(key: string): void {
    globalThis.localStorage?.removeItem(key);
  },

  setItem(key: string, value: string): void {
    globalThis.localStorage?.setItem(key, value);
  },
};
