export type EmployeeSortBy = 'fullName' | 'salary' | 'country' | 'jobTitle' | 'createdAt' | 'joiningDate';

export type EmployeeSortOrder = 'asc' | 'desc';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';

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

export type DashboardMetrics = {
  totalEmployees: number;
  highestPayingCountry: string | null;
  highestPayingRole: string | null;
  medianSalary: number | null;
  salaryDistribution: SalaryDistributionBucket[];
};
