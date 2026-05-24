import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { DashboardMetrics } from '@blackhr/shared-types';
import { SalaryJobTitleQueryDto } from '../dto/salary-country-query.dto';
import {
  CountrySalaryInsightsResponseDto,
  DashboardSalaryInsightsResponseDto,
  JobTitleSalaryInsightsResponseDto,
} from '../dto/salary-insights-response.dto';
import { SalaryInsightsService, type CountryInsights, type JobTitleInsights } from '../services/salary-insights.service';

@ApiTags('salary-insights')
@Controller('salary-insights')
export class SalaryInsightsController {
  constructor(private readonly salaryInsightsService: SalaryInsightsService) {}

  @Get('country/:country')
  @ApiParam({ name: 'country', type: String })
  @ApiOkResponse({ description: 'Country salary insights returned successfully', type: CountrySalaryInsightsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiNotFoundResponse({ description: 'Country data not found' })
  countryInsights(@Param('country') country: string): Promise<CountryInsights> {
    return this.salaryInsightsService.countryInsights(country);
  }

  @Get('job-title')
  @ApiQuery({ name: 'country', required: true, type: String })
  @ApiQuery({ name: 'jobTitle', required: true, type: String })
  @ApiOkResponse({ description: 'Job title salary insights returned successfully', type: JobTitleSalaryInsightsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiNotFoundResponse({ description: 'Salary data not found' })
  jobTitleInsights(@Query() query: SalaryJobTitleQueryDto): Promise<JobTitleInsights> {
    return this.salaryInsightsService.jobTitleInsights(query);
  }

  @Get('dashboard')
  @ApiOkResponse({ description: 'Dashboard salary metrics returned successfully', type: DashboardSalaryInsightsResponseDto })
  dashboardMetrics(): Promise<DashboardMetrics> {
    return this.salaryInsightsService.dashboardMetrics();
  }
}
