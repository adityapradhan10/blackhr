import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import type { EmployeeSortBy, EmployeeSortOrder } from '../dto/employee-query.dto';

export const EMPLOYEES_REPOSITORY = Symbol('EMPLOYEES_REPOSITORY');

export type EmployeeRecord = {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  joiningDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmployeeData = {
  employeeId: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: string;
  joiningDate: Date;
};

export type EmployeeFilters = {
  page?: number;
  limit?: number;
  skip?: number;
  search?: string;
  country?: string;
  department?: string;
  jobTitle?: string;
  sortBy?: EmployeeSortBy;
  sortOrder?: EmployeeSortOrder;
};

export type EmployeesRepositoryPort = {
  create(data: CreateEmployeeData): Promise<EmployeeRecord>;
  count(filters: EmployeeFilters): Promise<number>;
  delete(id: string): Promise<EmployeeRecord>;
  findByEmail(email: string): Promise<EmployeeRecord | null>;
  findById(id: string): Promise<EmployeeRecord | null>;
  findMany(filters: EmployeeFilters): Promise<EmployeeRecord[]>;
  update(id: string, data: Partial<CreateEmployeeData>): Promise<EmployeeRecord>;
};

@Injectable()
export class EmployeesRepository implements EmployeesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateEmployeeData): Promise<EmployeeRecord> {
    return this.prisma.employee.create({ data });
  }

  count(filters: EmployeeFilters): Promise<number> {
    return this.prisma.employee.count({ where: this.buildWhere(filters) });
  }

  delete(id: string): Promise<EmployeeRecord> {
    return this.prisma.employee.delete({ where: { id } });
  }

  findByEmail(email: string): Promise<EmployeeRecord | null> {
    return this.prisma.employee.findUnique({ where: { email } });
  }

  findById(id: string): Promise<EmployeeRecord | null> {
    return this.prisma.employee.findUnique({ where: { id } });
  }

  findMany(filters: EmployeeFilters): Promise<EmployeeRecord[]> {
    return this.prisma.employee.findMany({
      orderBy: this.buildOrderBy(filters),
      skip: filters.skip,
      take: filters.limit,
      where: this.buildWhere(filters),
    });
  }

  update(id: string, data: Partial<CreateEmployeeData>): Promise<EmployeeRecord> {
    return this.prisma.employee.update({ data, where: { id } });
  }

  private buildWhere(filters: EmployeeFilters): Prisma.EmployeeWhereInput {
    return {
      ...(filters.country ? { country: filters.country } : {}),
      ...(filters.department ? { department: filters.department } : {}),
      ...(filters.jobTitle ? { jobTitle: filters.jobTitle } : {}),
      ...(filters.search
        ? {
            OR: [{ fullName: { contains: filters.search } }, { email: { contains: filters.search } }],
          }
        : {}),
    };
  }

  private buildOrderBy(filters: EmployeeFilters): Prisma.EmployeeOrderByWithRelationInput {
    return {
      [filters.sortBy ?? 'createdAt']: filters.sortOrder ?? 'desc',
    };
  }
}
