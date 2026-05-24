export const EMPLOYEE_SORT_BY_FIELDS = [
  'fullName',
  'salary',
  'country',
  'jobTitle',
  'createdAt',
  'joiningDate',
] as const;

export const EMPLOYEE_SORT_ORDERS = ['asc', 'desc'] as const;

export type EmployeeSortBy = (typeof EMPLOYEE_SORT_BY_FIELDS)[number];
export type EmployeeSortOrder = (typeof EMPLOYEE_SORT_ORDERS)[number];

export const COUNTRY_OPTIONS = [
  'India',
  'United States',
  'Germany',
  'Canada',
  'United Kingdom',
  'Australia',
] as const;

export const DEPARTMENT_OPTIONS = [
  'Engineering',
  'Product',
  'HR',
  'Finance',
  'Sales',
] as const;

export const JOB_TITLE_OPTIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Product Manager',
  'HR Specialist',
  'Finance Analyst',
] as const;

export const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT'] as const;

export type Country = (typeof COUNTRY_OPTIONS)[number];
export type Department = (typeof DEPARTMENT_OPTIONS)[number];
export type JobTitle = (typeof JOB_TITLE_OPTIONS)[number];
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export type Employee = {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  salary: number;
  currency: string;
  employmentType: EmploymentType;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeResponse = Employee;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type EmployeeListResponse = PaginatedResponse<EmployeeResponse>;

export type EmployeeQuery = {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  department?: string;
  jobTitle?: string;
  sortBy?: EmployeeSortBy;
  sortOrder?: EmployeeSortOrder;
};

export type CreateEmployeeRequest = {
  fullName: string;
  email: string;
  salary: number;
  country: string;
  jobTitle: string;
  joiningDate: string | Date;
  department?: string;
  employmentType?: EmploymentType;
  currency?: string;
};

export type UpdateEmployeeRequest = Partial<CreateEmployeeRequest>;

export type CreateEmployeeInput = CreateEmployeeRequest;

export type UpdateEmployeeInput = UpdateEmployeeRequest;

export type CountrySalaryInsight = {
  country: string;
  minSalary: number;
  maxSalary: number;
  averageSalary: number;
};

export type JobTitleSalaryInsight = {
  country: string;
  jobTitle: string;
  averageSalary: number;
};

export type SalaryDistributionBucket = {
  label: string;
  count: number;
};

export type DepartmentDistributionBucket = SalaryDistributionBucket;

export type DashboardMetrics = {
  totalEmployees: number;
  highestPayingCountry: string | null;
  highestPayingRole: string | null;
  medianSalary: number | null;
  salaryDistribution: SalaryDistributionBucket[];
  departmentDistribution: DepartmentDistributionBucket[];
};
