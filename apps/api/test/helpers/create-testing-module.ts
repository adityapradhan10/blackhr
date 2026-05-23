import { Test, type TestingModuleBuilder } from '@nestjs/testing';
import type { ModuleMetadata } from '@nestjs/common';

export function createTestingModule(metadata: ModuleMetadata): TestingModuleBuilder {
  return Test.createTestingModule(metadata);
}
