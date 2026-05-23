import { EmployeeGenerator } from '../../prisma/seed/employee-generator';
import { SALARY_RANGES } from '../../prisma/seed/constants';

describe(EmployeeGenerator.name, () => {
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
