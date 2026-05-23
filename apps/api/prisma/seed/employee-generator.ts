import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Prisma } from '@prisma/client';
import {
  COUNTRIES,
  EMPLOYMENT_TYPES,
  FAKER_SEED,
  JOB_TITLES,
  JOB_TITLE_DEPARTMENTS,
  SALARY_RANGES,
} from './constants';

const FIRST_NAMES_PATH = resolve(process.cwd(), 'assets/first_names.txt');
const LAST_NAMES_PATH = resolve(process.cwd(), 'assets/last_names.txt');

export class EmployeeGenerator {
  private readonly firstNames: string[];
  private readonly lastNames: string[];

  constructor() {
    this.firstNames = this.loadNames(FIRST_NAMES_PATH);
    this.lastNames = this.loadNames(LAST_NAMES_PATH);
  }

  generateEmployees(count: number, offset = 0): Prisma.EmployeeCreateManyInput[] {
    return Array.from({ length: count }, (_, index) => this.generateEmployee(offset + index));
  }

  private generateEmployee(index: number): Prisma.EmployeeCreateManyInput {
    const employeeNumber = index + 1;
    const firstName = this.firstNames[index % this.firstNames.length];
    const lastName = this.lastNames[Math.floor(index / this.firstNames.length) % this.lastNames.length];
    const jobTitle = JOB_TITLES[index % JOB_TITLES.length];
    const salaryRange = SALARY_RANGES[jobTitle];

    return {
      country: COUNTRIES[index % COUNTRIES.length],
      currency: 'USD',
      department: JOB_TITLE_DEPARTMENTS[jobTitle],
      email: this.buildEmail(firstName, lastName, employeeNumber),
      employeeId: `BHR-${employeeNumber.toString().padStart(5, '0')}`,
      employmentType: EMPLOYMENT_TYPES[index % EMPLOYMENT_TYPES.length],
      fullName: `${firstName} ${lastName}`,
      jobTitle,
      joiningDate: this.generateJoiningDate(index),
      salary: this.generateSalary(index, salaryRange.min, salaryRange.max),
    };
  }

  private loadNames(filePath: string): string[] {
    const names = readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);

    if (names.length === 0) {
      throw new Error(`Seed asset has no names: ${filePath}`);
    }

    return names;
  }

  private buildEmail(firstName: string, lastName: string, employeeNumber: number): string {
    const localPart = `${firstName}.${lastName}.e${employeeNumber.toString().padStart(5, '0')}`
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '');

    return `${localPart}@blackhr.example`;
  }

  private generateSalary(index: number, min: number, max: number): number {
    return min + (this.seededInt(index, max - min + 1) % (max - min + 1));
  }

  private generateJoiningDate(index: number): Date {
    const start = Date.UTC(2018, 0, 1);
    const end = Date.UTC(2026, 0, 1);
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    const days = Math.floor((end - start) / dayInMilliseconds);

    return new Date(start + this.seededInt(index + 1, days) * dayInMilliseconds);
  }

  private seededInt(index: number, modulo: number): number {
    return (FAKER_SEED + index * 1_103_515_245 + 12_345) % modulo;
  }
}
