import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateEmployeeDto } from '../dto/create-employee.dto';
import type { EmployeeQueryDto } from '../dto/employee-query.dto';
import type { UpdateEmployeeDto } from '../dto/update-employee.dto';
import {
  EMPLOYEES_REPOSITORY,
  type CreateEmployeeData,
  type EmployeeFilters,
  type EmployeeRecord,
  type EmployeesRepositoryPort,
} from '../repositories/employees.repository';

export type PaginatedEmployees = {
  data: EmployeeRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

@Injectable()
export class EmployeesService {
  constructor(
    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: EmployeesRepositoryPort,
  ) {}

  async createEmployee(dto: CreateEmployeeDto): Promise<EmployeeRecord> {
    const existingEmployee = await this.employeesRepository.findByEmail(dto.email);

    if (existingEmployee) {
      throw new ConflictException('Employee email already exists');
    }

    return this.employeesRepository.create(this.toCreateData(dto));
  }

  async findAll(query: EmployeeQueryDto): Promise<PaginatedEmployees> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const filters: EmployeeFilters = {
      ...query,
      limit,
      page,
      skip: (page - 1) * limit,
    };
    const [data, total] = await Promise.all([
      this.employeesRepository.findMany(filters),
      this.employeesRepository.count(filters),
    ]);

    return {
      data,
      meta: {
        limit,
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<EmployeeRecord> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto): Promise<EmployeeRecord> {
    await this.findById(id);

    return this.employeesRepository.update(id, dto);
  }

  async deleteEmployee(id: string): Promise<EmployeeRecord> {
    await this.findById(id);

    return this.employeesRepository.delete(id);
  }

  private toCreateData(dto: CreateEmployeeDto): CreateEmployeeData {
    return {
      country: dto.country,
      currency: dto.currency ?? 'USD',
      department: dto.department ?? 'General',
      email: dto.email,
      employeeId: `BHR-${randomUUID()}`,
      employmentType: dto.employmentType ?? 'FULL_TIME',
      fullName: dto.fullName,
      jobTitle: dto.jobTitle,
      joiningDate: dto.joiningDate,
      salary: dto.salary,
    };
  }
}
