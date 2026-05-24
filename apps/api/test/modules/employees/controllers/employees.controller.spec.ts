import { EmployeesController } from '../../../../src/modules/employees/controllers/employees.controller';
import type { CreateEmployeeDto } from '../../../../src/modules/employees/dto/create-employee.dto';
import type { UpdateEmployeeDto } from '../../../../src/modules/employees/dto/update-employee.dto';
import type { EmployeeRecord } from '../../../../src/modules/employees/repositories/employees.repository';
import type {
  EmployeesService,
  PaginatedEmployees,
} from '../../../../src/modules/employees/services/employees.service';

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

function createService(): jest.Mocked<EmployeesService> {
  return {
    createEmployee: jest.fn(),
    deleteEmployee: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateEmployee: jest.fn(),
  } as unknown as jest.Mocked<EmployeesService>;
}

describe(EmployeesController.name, () => {
  it('creates employee', async () => {
    const service = createService();
    const employee = buildEmployee();
    const dto: CreateEmployeeDto = {
      country: 'India',
      email: 'aarav.sharma@blackhr.example',
      fullName: 'Aarav Sharma',
      jobTitle: 'Software Engineer',
      joiningDate,
      salary: 120000,
    };
    service.createEmployee.mockResolvedValue(employee);
    const controller = new EmployeesController(service);

    await expect(controller.createEmployee(dto)).resolves.toEqual(employee);
    expect(service.createEmployee).toHaveBeenCalledWith(dto);
  });

  it('returns paginated employees', async () => {
    const service = createService();
    const response: PaginatedEmployees = {
      data: [buildEmployee()],
      meta: {
        limit: 20,
        page: 1,
        total: 1,
        totalPages: 1,
      },
    };
    service.findAll.mockResolvedValue(response);
    const controller = new EmployeesController(service);

    await expect(controller.findAll({ country: 'India' })).resolves.toEqual(response);
    expect(service.findAll).toHaveBeenCalledWith({ country: 'India' });
  });

  it('returns employee by id', async () => {
    const service = createService();
    const employee = buildEmployee();
    service.findById.mockResolvedValue(employee);
    const controller = new EmployeesController(service);

    await expect(controller.findById('employee-1')).resolves.toEqual(employee);
    expect(service.findById).toHaveBeenCalledWith('employee-1');
  });

  it('updates employee', async () => {
    const service = createService();
    const employee = buildEmployee({ salary: 130000 });
    const dto: UpdateEmployeeDto = { salary: 130000 };
    service.updateEmployee.mockResolvedValue(employee);
    const controller = new EmployeesController(service);

    await expect(controller.updateEmployee('employee-1', dto)).resolves.toEqual(employee);
    expect(service.updateEmployee).toHaveBeenCalledWith('employee-1', dto);
  });

  it('deletes employee', async () => {
    const service = createService();
    const employee = buildEmployee();
    service.deleteEmployee.mockResolvedValue(employee);
    const controller = new EmployeesController(service);

    await expect(controller.deleteEmployee('employee-1')).resolves.toEqual(employee);
    expect(service.deleteEmployee).toHaveBeenCalledWith('employee-1');
  });
});
