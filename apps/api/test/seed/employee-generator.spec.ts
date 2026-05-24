import { EmployeeGenerator } from '../../prisma/seed/employee-generator';
import { SALARY_RANGES, SEED_EMPLOYEE_COUNT } from '../../prisma/seed/constants';

describe(EmployeeGenerator.name, () => {
  it('generates 10000 employees', () => {
    const generator = new EmployeeGenerator();

    expect(generator.generateEmployees(SEED_EMPLOYEE_COUNT)).toHaveLength(10_000);
  });

  it('generates unique emails', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);

    expect(new Set(employees.map((employee) => employee.email)).size).toBe(SEED_EMPLOYEE_COUNT);
  });

  it('generates unique employeeIds', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);

    expect(new Set(employees.map((employee) => employee.employeeId)).size).toBe(SEED_EMPLOYEE_COUNT);
  });

  it('generates salaries within job title ranges', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);

    for (const employee of employees) {
      const salaryRange = SALARY_RANGES[employee.jobTitle as keyof typeof SALARY_RANGES];

      expect(employee.salary).toBeGreaterThanOrEqual(salaryRange.min);
      expect(employee.salary).toBeLessThanOrEqual(salaryRange.max);
    }
  });

  it('generates deterministic employees from seed name assets', () => {
    const generator = new EmployeeGenerator();

    const [firstEmployee, secondEmployee] = generator.generateEmployees(2);

    expect(firstEmployee).toEqual(
      expect.objectContaining({
        employeeId: 'BHR-00001',
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma.e00001@blackhr.example',
        country: 'India',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        currency: 'USD',
        employmentType: 'FULL_TIME',
      }),
    );
    expect(secondEmployee).toEqual(
      expect.objectContaining({
        employeeId: 'BHR-00002',
        fullName: 'Aditi Sharma',
        email: 'aditi.sharma.e00002@blackhr.example',
      }),
    );
    expect(firstEmployee.salary).toBeGreaterThanOrEqual(SALARY_RANGES['Software Engineer'].min);
    expect(firstEmployee.salary).toBeLessThanOrEqual(SALARY_RANGES['Software Engineer'].max);
  });
});
