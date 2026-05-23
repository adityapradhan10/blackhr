import { type DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended';

export function createPrismaMock<T extends object>(): DeepMockProxy<T> {
  return mockDeep<T>();
}

export function resetPrismaMock<T extends object>(mock: DeepMockProxy<T>) {
  mockReset(mock);
}
