import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Prisma } from '@prisma/client';
import {
  COUNTRIES,
  EMPLOYMENT_TYPES,
  FAKER_SEED,
  getSalaryProfile,
  JOB_TITLES,
  JOB_TITLE_DEPARTMENTS,
  type SalaryProfile,
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
    const country = COUNTRIES[index % COUNTRIES.length];
    const department = JOB_TITLE_DEPARTMENTS[jobTitle];
    const salaryProfile = getSalaryProfile(jobTitle, country);

    return {
      country,
      currency: 'USD',
      department,
      email: this.buildEmail(firstName, lastName, employeeNumber),
      employeeId: `BHR-${employeeNumber.toString().padStart(5, '0')}`,
      employmentType: EMPLOYMENT_TYPES[index % EMPLOYMENT_TYPES.length],
      fullName: `${firstName} ${lastName}`,
      jobTitle,
      joiningDate: this.generateJoiningDate(index),
      salary: this.generateSalary(index, salaryProfile),
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

  private generateSalary(index: number, profile: SalaryProfile): number {
    const raw = this.seededNormal(index, profile.mean, profile.stdDev);
    const clamped = Math.min(profile.max, Math.max(profile.min, raw));

    return Math.round(clamped / 500) * 500;
  }

  private seededNormal(index: number, mean: number, stdDev: number): number {
    const u1 = this.seededUniform(index, 0);
    const u2 = this.seededUniform(index, 1);
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return mean + z0 * stdDev;
  }

  private seededUniform(index: number, stream: number): number {
    const value = this.seededInt(index * 31 + stream * 17 + 7, 1_000_000);

    return (value + 1) / 1_000_001;
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
