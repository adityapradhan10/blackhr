import { EmployeeGenerator } from '../../prisma/seed/employee-generator';
import {
  getSalaryProfile,
  SALARY_RANGES,
  SEED_EMPLOYEE_COUNT,
} from '../../prisma/seed/constants';

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

  it('generates salaries within country and job title ranges', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);

    for (const employee of employees) {
      const salaryProfile = getSalaryProfile(
        employee.jobTitle as keyof typeof SALARY_RANGES,
        employee.country as Parameters<typeof getSalaryProfile>[1],
      );

      expect(employee.salary).toBeGreaterThanOrEqual(salaryProfile.min);
      expect(employee.salary).toBeLessThanOrEqual(salaryProfile.max);
      expect(employee.salary % 500).toBe(0);
    }
  });

  it('clusters salaries around country, department, and title means', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);
    const softwareEngineers = employees.filter(
      (employee) => employee.jobTitle === 'Software Engineer' && employee.country === 'United States',
    );
    const seniorSoftwareEngineers = employees.filter(
      (employee) => employee.jobTitle === 'Senior Software Engineer' && employee.country === 'United States',
    );
    const softwareEngineerProfile = getSalaryProfile('Software Engineer', 'United States');
    const seniorSoftwareEngineerProfile = getSalaryProfile('Senior Software Engineer', 'United States');

    const average = (salaries: number[]) =>
      salaries.reduce((total, salary) => total + salary, 0) / salaries.length;

    const softwareEngineerAverage = average(softwareEngineers.map((employee) => employee.salary));
    const seniorSoftwareEngineerAverage = average(
      seniorSoftwareEngineers.map((employee) => employee.salary),
    );

    expect(softwareEngineerAverage).toBeGreaterThan(softwareEngineerProfile.mean * 0.85);
    expect(softwareEngineerAverage).toBeLessThan(softwareEngineerProfile.mean * 1.15);
    expect(seniorSoftwareEngineerAverage).toBeGreaterThan(softwareEngineerAverage);
    expect(seniorSoftwareEngineerAverage).toBeGreaterThan(seniorSoftwareEngineerProfile.mean * 0.85);
    expect(seniorSoftwareEngineerAverage).toBeLessThan(seniorSoftwareEngineerProfile.mean * 1.15);
  });

  it('pays higher in high-cost countries than low-cost countries for the same role', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT);
    const average = (salaries: number[]) =>
      salaries.reduce((total, salary) => total + salary, 0) / salaries.length;
    const indiaSoftwareEngineers = employees.filter(
      (employee) => employee.country === 'India' && employee.jobTitle === 'Software Engineer',
    );
    const australiaSoftwareEngineers = employees.filter(
      (employee) => employee.country === 'Australia' && employee.jobTitle === 'Software Engineer',
    );

    expect(average(australiaSoftwareEngineers.map((employee) => employee.salary))).toBeGreaterThan(
      average(indiaSoftwareEngineers.map((employee) => employee.salary)),
    );
  });

  it('produces bell-shaped salary spread instead of a flat distribution', () => {
    const generator = new EmployeeGenerator();
    const employees = generator.generateEmployees(SEED_EMPLOYEE_COUNT).filter(
      (employee) => employee.jobTitle === 'Software Engineer' && employee.country === 'United States',
    );
    const profile = getSalaryProfile('Software Engineer', 'United States');
    const bucketSize = 10_000;
    const bucketCounts = new Map<number, number>();

    for (const employee of employees) {
      const bucket = Math.floor(employee.salary / bucketSize) * bucketSize;
      bucketCounts.set(bucket, (bucketCounts.get(bucket) ?? 0) + 1);
    }

    const centerBucket = Math.floor(profile.mean / bucketSize) * bucketSize;
    const edgeBuckets = [profile.min, profile.max - bucketSize];
    const centerCount = bucketCounts.get(centerBucket) ?? 0;
    const edgeCount = edgeBuckets.reduce((total, bucket) => total + (bucketCounts.get(bucket) ?? 0), 0);

    expect(centerCount).toBeGreaterThan(edgeCount);
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
        salary: 21_500,
      }),
    );
    expect(secondEmployee).toEqual(
      expect.objectContaining({
        employeeId: 'BHR-00002',
        fullName: 'Aditi Sharma',
        email: 'aditi.sharma.e00002@blackhr.example',
      }),
    );
    expect(firstEmployee.salary).toBeGreaterThanOrEqual(
      getSalaryProfile('Software Engineer', 'India').min,
    );
    expect(firstEmployee.salary).toBeLessThanOrEqual(getSalaryProfile('Software Engineer', 'India').max);
  });
});
