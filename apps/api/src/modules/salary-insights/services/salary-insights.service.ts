import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CountrySalaryInsight, DashboardMetrics, JobTitleSalaryInsight } from '@blackhr/shared-types';
import type { SalaryJobTitleQueryDto } from '../dto/salary-country-query.dto';
import {
  SALARY_INSIGHTS_REPOSITORY,
  type SalaryInsightsRepositoryPort,
} from '../repositories/salary-insights.repository';

export type CountryInsights = CountrySalaryInsight;

export type JobTitleInsights = JobTitleSalaryInsight;

@Injectable()
export class SalaryInsightsService {
  constructor(
    @Inject(SALARY_INSIGHTS_REPOSITORY)
    private readonly salaryInsightsRepository: SalaryInsightsRepositoryPort,
  ) {}

  async countryInsights(country: string): Promise<CountryInsights> {
    const normalizedCountry = country.trim();

    if (!normalizedCountry) {
      throw new BadRequestException('Invalid request');
    }

    const metrics = await this.salaryInsightsRepository.findCountrySalaryMetrics(normalizedCountry);

    if (metrics.count === 0 || metrics.minSalary === null || metrics.maxSalary === null || metrics.averageSalary === null) {
      throw new NotFoundException('Country data not found');
    }

    return {
      averageSalary: Math.round(metrics.averageSalary),
      country: normalizedCountry,
      maxSalary: metrics.maxSalary,
      minSalary: metrics.minSalary,
    };
  }

  async jobTitleInsights(query: SalaryJobTitleQueryDto): Promise<JobTitleInsights> {
    const country = query.country.trim();
    const jobTitle = query.jobTitle.trim();

    if (!country || !jobTitle) {
      throw new BadRequestException('Invalid request');
    }

    const metrics = await this.salaryInsightsRepository.findJobTitleAverageSalary(country, jobTitle);

    if (metrics.count === 0 || metrics.averageSalary === null) {
      throw new NotFoundException('Salary data not found');
    }

    return {
      averageSalary: Math.round(metrics.averageSalary),
      country,
      jobTitle,
    };
  }

  dashboardMetrics(): Promise<DashboardMetrics> {
    return this.salaryInsightsRepository.findDashboardMetrics();
  }
}
