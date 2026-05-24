import { ConflictException, NotFoundException } from '@nestjs/common';
import { EmployeesService } from '../../../../src/modules/employees/services/employees.service';
import type { CreateEmployeeDto } from '../../../../src/modules/employees/dto/create-employee.dto';
import type { UpdateEmployeeDto } from '../../../../src/modules/employees/dto/update-employee.dto';
import type {
  EmployeeRecord,
  EmployeesRepositoryPort,
} from '../../../../src/modules/employees/repositories/employees.repository';

const joiningDate = new Date('2024-01-15T00:00:00.000Z');

function buildEmployee(overrides: Partial<EmployeeRecord> = {}): EmployeeRecord {
  return {
    country: 'India',
    createdAt: new Date('2024-01-16T00:00:00.000Z'),
    currency: 'USD',
    department: 'Engineering',
    email: 'aarav.sharma@blackhr.example',
    employeeId: 'BHR-00001',
    employmentType: 'FULL_TIME',
    fullName: 'Aarav Sharma',
    id: 'employee-1',
    jobTitle: 'Software Engineer',
    joiningDate,
    salary: 120000,
    updatedAt: new Date('2024-01-16T00:00:00.000Z'),
    ...overrides,
  };
}

function buildCreateDto(overrides: Partial<CreateEmployeeDto> = {}): CreateEmployeeDto {
  return {
    country: 'India',
    department: 'Engineering',
    email: 'aarav.sharma@blackhr.example',
    employmentType: 'FULL_TIME',
    fullName: 'Aarav Sharma',
    jobTitle: 'Software Engineer',
    joiningDate,
    salary: 120000,
    ...overrides,
  };
}

function createRepository(): jest.Mocked<EmployeesRepositoryPort> {
  return {
    count: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  };
}

describe(EmployeesService.name, () => {
  describe('createEmployee', () => {
    it('creates employee successfully', async () => {
      const repository = createRepository();
      const employee = buildEmployee();
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue(employee);
      const service = new EmployeesService(repository);

      await expect(service.createEmployee(buildCreateDto())).resolves.toEqual(employee);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'aarav.sharma@blackhr.example',
          employeeId: expect.stringMatching(/^BHR-/),
          fullName: 'Aarav Sharma',
        }),
      );
    });

    it('throws duplicate email error', async () => {
      const repository = createRepository();
      repository.findByEmail.mockResolvedValue(buildEmployee());
      const service = new EmployeesService(repository);

      await expect(service.createEmployee(buildCreateDto())).rejects.toBeInstanceOf(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('returns paginated employees', async () => {
      const repository = createRepository();
      const employees = [buildEmployee()];
      repository.findMany.mockResolvedValue(employees);
      repository.count.mockResolvedValue(1);
      const service = new EmployeesService(repository);

      await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
        data: employees,
        meta: {
          limit: 20,
          page: 1,
          total: 1,
          totalPages: 1,
        },
      });
      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          page: 1,
          skip: 0,
        }),
      );
    });

    it('filters by country', async () => {
      const repository = createRepository();
      const employees = [buildEmployee({ country: 'Germany', id: 'employee-2' })];
      repository.findMany.mockResolvedValue(employees);
      repository.count.mockResolvedValue(1);
      const service = new EmployeesService(repository);

      await expect(service.findAll({ country: 'Germany' })).resolves.toEqual(
        expect.objectContaining({ data: employees }),
      );
      expect(repository.findMany).toHaveBeenCalledWith(expect.objectContaining({ country: 'Germany' }));
      expect(repository.count).toHaveBeenCalledWith(expect.objectContaining({ country: 'Germany' }));
    });

    it('searches by name', async () => {
      const repository = createRepository();
      const employees = [buildEmployee({ fullName: 'Aditi Sharma', id: 'employee-3' })];
      repository.findMany.mockResolvedValue(employees);
      repository.count.mockResolvedValue(1);
      const service = new EmployeesService(repository);

      await expect(service.findAll({ search: 'aditi' })).resolves.toEqual(expect.objectContaining({ data: employees }));
      expect(repository.findMany).toHaveBeenCalledWith(expect.objectContaining({ search: 'aditi' }));
      expect(repository.count).toHaveBeenCalledWith(expect.objectContaining({ search: 'aditi' }));
    });
  });

  describe('findById', () => {
    it('returns employee', async () => {
      const repository = createRepository();
      const employee = buildEmployee();
      repository.findById.mockResolvedValue(employee);
      const service = new EmployeesService(repository);

      await expect(service.findById('employee-1')).resolves.toEqual(employee);
    });

    it('throws not found', async () => {
      const repository = createRepository();
      repository.findById.mockResolvedValue(null);
      const service = new EmployeesService(repository);

      await expect(service.findById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateEmployee', () => {
    it('updates employee', async () => {
      const repository = createRepository();
      const employee = buildEmployee({ salary: 130000 });
      const update: UpdateEmployeeDto = { salary: 130000 };
      repository.findById.mockResolvedValue(buildEmployee());
      repository.update.mockResolvedValue(employee);
      const service = new EmployeesService(repository);

      await expect(service.updateEmployee('employee-1', update)).resolves.toEqual(employee);
      expect(repository.update).toHaveBeenCalledWith('employee-1', update);
    });

    it('throws if employee missing', async () => {
      const repository = createRepository();
      repository.findById.mockResolvedValue(null);
      const service = new EmployeesService(repository);

      await expect(service.updateEmployee('missing', { salary: 130000 })).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteEmployee', () => {
    it('deletes employee', async () => {
      const repository = createRepository();
      const employee = buildEmployee();
      repository.findById.mockResolvedValue(employee);
      repository.delete.mockResolvedValue(employee);
      const service = new EmployeesService(repository);

      await expect(service.deleteEmployee('employee-1')).resolves.toEqual(employee);
      expect(repository.delete).toHaveBeenCalledWith('employee-1');
    });

    it('throws if employee missing', async () => {
      const repository = createRepository();
      repository.findById.mockResolvedValue(null);
      const service = new EmployeesService(repository);

      await expect(service.deleteEmployee('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
