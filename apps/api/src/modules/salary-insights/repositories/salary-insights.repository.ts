import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

export const SALARY_INSIGHTS_REPOSITORY = Symbol('SALARY_INSIGHTS_REPOSITORY');

export type CountrySalaryMetrics = {
  count: number;
  minSalary: number | null;
  maxSalary: number | null;
  averageSalary: number | null;
};

export type JobTitleSalaryMetrics = {
  count: number;
  averageSalary: number | null;
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

export type SalaryInsightsRepositoryPort = {
  findCountrySalaryMetrics(country: string): Promise<CountrySalaryMetrics>;
  findDashboardMetrics(): Promise<DashboardMetrics>;
  findJobTitleAverageSalary(country: string, jobTitle: string): Promise<JobTitleSalaryMetrics>;
};

type CountryAverageRow = {
  country: string;
  _avg: {
    salary: number | null;
  };
};

type JobTitleAverageRow = {
  jobTitle: string;
  _avg: {
    salary: number | null;
  };
};

type SalaryBucketRow = {
  bucket: number;
  count: bigint | number;
};

type MedianSalaryRow = {
  medianSalary: number | bigint | null;
};

@Injectable()
export class SalaryInsightsRepository implements SalaryInsightsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findCountrySalaryMetrics(country: string): Promise<CountrySalaryMetrics> {
    const result = await this.prisma.employee.aggregate({
      _avg: { salary: true },
      _count: { _all: true },
      _max: { salary: true },
      _min: { salary: true },
      where: { country },
    });

    return {
      averageSalary: result._avg.salary,
      count: result._count._all,
      maxSalary: result._max.salary,
      minSalary: result._min.salary,
    };
  }

  async findJobTitleAverageSalary(country: string, jobTitle: string): Promise<JobTitleSalaryMetrics> {
    const result = await this.prisma.employee.aggregate({
      _avg: { salary: true },
      _count: { _all: true },
      where: {
        country,
        jobTitle,
      },
    });

    return {
      averageSalary: result._avg.salary,
      count: result._count._all,
    };
  }

  async findDashboardMetrics(): Promise<DashboardMetrics> {
    const [totalEmployees, highestCountry, highestRole, medianSalary, salaryDistribution] = await Promise.all([
      this.prisma.employee.count(),
      this.findHighestPayingCountry(),
      this.findHighestPayingRole(),
      this.findMedianSalary(),
      this.findSalaryDistribution(),
    ]);

    return {
      highestPayingCountry: highestCountry,
      highestPayingRole: highestRole,
      medianSalary,
      salaryDistribution,
      totalEmployees,
    };
  }

  private async findHighestPayingCountry(): Promise<string | null> {
    const [row] = await this.prisma.employee.groupBy({
      _avg: { salary: true },
      by: ['country'],
      orderBy: {
        _avg: {
          salary: 'desc',
        },
      },
      take: 1,
    });

    return (row as CountryAverageRow | undefined)?.country ?? null;
  }

  private async findHighestPayingRole(): Promise<string | null> {
    const [row] = await this.prisma.employee.groupBy({
      _avg: { salary: true },
      by: ['jobTitle'],
      orderBy: {
        _avg: {
          salary: 'desc',
        },
      },
      take: 1,
    });

    return (row as JobTitleAverageRow | undefined)?.jobTitle ?? null;
  }

  private async findMedianSalary(): Promise<number | null> {
    const [row] = await this.prisma.$queryRaw<MedianSalaryRow[]>`
      SELECT AVG(salary) AS medianSalary
      FROM (
        SELECT salary
        FROM Employee
        ORDER BY salary
        LIMIT 2 - (SELECT COUNT(*) FROM Employee) % 2
        OFFSET (SELECT (COUNT(*) - 1) / 2 FROM Employee)
      )
    `;

    return this.toNullableNumber(row?.medianSalary);
  }

  private async findSalaryDistribution(): Promise<SalaryDistributionBucket[]> {
    const rows = await this.prisma.$queryRaw<SalaryBucketRow[]>`
      SELECT
        CAST(salary / 50000 AS INTEGER) AS bucket,
        COUNT(*) AS count
      FROM Employee
      GROUP BY bucket
      ORDER BY bucket
    `;

    return rows.map((row) => ({
      count: Number(row.count),
      label: this.buildBucketLabel(row.bucket),
    }));
  }

  private buildBucketLabel(bucket: number): string {
    const start = bucket * 50_000;
    const end = start + 49_999;

    return `${start}-${end}`;
  }

  private toNullableNumber(value: number | bigint | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    return Number(value);
  }
}
