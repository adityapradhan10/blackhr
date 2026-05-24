import { ApiProperty } from '@nestjs/swagger';
import type {
  CountrySalaryInsight,
  DashboardMetrics,
  JobTitleSalaryInsight,
  SalaryDistributionBucket,
} from '@blackhr/shared-types';

export class CountrySalaryInsightsResponseDto implements CountrySalaryInsight {
  @ApiProperty({ example: 'India', type: String })
  country!: string;

  @ApiProperty({ example: 50000, type: Number })
  minSalary!: number;

  @ApiProperty({ example: 200000, type: Number })
  maxSalary!: number;

  @ApiProperty({ example: 95000, type: Number })
  averageSalary!: number;
}

export class JobTitleSalaryInsightsResponseDto implements JobTitleSalaryInsight {
  @ApiProperty({ example: 'India', type: String })
  country!: string;

  @ApiProperty({ example: 'Software Engineer', type: String })
  jobTitle!: string;

  @ApiProperty({ example: 120000, type: Number })
  averageSalary!: number;
}

class SalaryDistributionBucketDto implements SalaryDistributionBucket {
  @ApiProperty({ example: '50000-99999', type: String })
  label!: string;

  @ApiProperty({ example: 2500, type: Number })
  count!: number;
}

export class DashboardSalaryInsightsResponseDto implements DashboardMetrics {
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

  @ApiProperty({ isArray: true, type: SalaryDistributionBucketDto })
  departmentDistribution!: SalaryDistributionBucketDto[];
}
