import { type MockProxy, mock, mockReset } from 'jest-mock-extended';

export function createRepositoryMock<T extends object>(): MockProxy<T> {
  return mock<T>();
}

export function resetRepositoryMock<T extends object>(mockedRepository: MockProxy<T>) {
  mockReset(mockedRepository);
}
