import { ApiProperty } from '@nestjs/swagger';

export class CountrySalaryInsightsResponseDto {
  @ApiProperty({ example: 'India', type: String })
  country!: string;

  @ApiProperty({ example: 50000, type: Number })
  minSalary!: number;

  @ApiProperty({ example: 200000, type: Number })
  maxSalary!: number;

  @ApiProperty({ example: 95000, type: Number })
  averageSalary!: number;
}

export class JobTitleSalaryInsightsResponseDto {
  @ApiProperty({ example: 'India', type: String })
  country!: string;

  @ApiProperty({ example: 'Software Engineer', type: String })
  jobTitle!: string;

  @ApiProperty({ example: 120000, type: Number })
  averageSalary!: number;
}

class SalaryDistributionBucketDto {
  @ApiProperty({ example: '50000-99999', type: String })
  label!: string;

  @ApiProperty({ example: 2500, type: Number })
  count!: number;
}

export class DashboardSalaryInsightsResponseDto {
  @ApiProperty({ example: 10000, type: Number })
  totalEmployees!: number;

  @ApiProperty({ example: 'United States', nullable: true, type: String })
  highestPayingCountry!: string | null;

  @ApiProperty({ example: 'Senior Software Engineer', nullable: true, type: String })
  highestPayingRole!: string | null;

  @ApiProperty({ example: 85000, nullable: true, type: Number })
  medianSalary!: number | null;

  @ApiProperty({ isArray: true, type: SalaryDistributionBucketDto })
  salaryDistribution!: SalaryDistributionBucketDto[];
}
