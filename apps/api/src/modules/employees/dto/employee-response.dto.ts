import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: 'employee-1', type: String })
  id!: string;

  @ApiProperty({ example: 'BHR-00001', type: String })
  employeeId!: string;

  @ApiProperty({ example: 'Aarav Sharma', type: String })
  fullName!: string;

  @ApiProperty({ example: 'aarav.sharma@blackhr.example', type: String })
  email!: string;

  @ApiProperty({ example: 'Software Engineer', type: String })
  jobTitle!: string;

  @ApiProperty({ example: 'Engineering', type: String })
  department!: string;

  @ApiProperty({ example: 'India', type: String })
  country!: string;

  @ApiProperty({ example: 120000, type: Number })
  salary!: number;

  @ApiProperty({ example: 'USD', type: String })
  currency!: string;

  @ApiProperty({ example: 'FULL_TIME', type: String })
  employmentType!: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z', format: 'date-time', type: String })
  joiningDate!: string;

  @ApiProperty({ example: '2024-01-16T00:00:00.000Z', format: 'date-time', type: String })
  createdAt!: string;

  @ApiProperty({ example: '2024-01-16T00:00:00.000Z', format: 'date-time', type: String })
  updatedAt!: string;
}

class PaginationMetaDto {
  @ApiProperty({ example: 1, type: Number })
  page!: number;

  @ApiProperty({ example: 20, type: Number })
  limit!: number;

  @ApiProperty({ example: 10000, type: Number })
  total!: number;

  @ApiProperty({ example: 500, type: Number })
  totalPages!: number;
}

export class PaginatedEmployeesResponseDto {
  @ApiProperty({ isArray: true, type: EmployeeResponseDto })
  data!: EmployeeResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
