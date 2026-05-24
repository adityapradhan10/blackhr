import { SalaryInsightsController } from '../../../../src/modules/salary-insights/controllers/salary-insights.controller';
import type { SalaryInsightsService } from '../../../../src/modules/salary-insights/services/salary-insights.service';

function createService(): jest.Mocked<SalaryInsightsService> {
  return {
    countryInsights: jest.fn(),
    dashboardMetrics: jest.fn(),
    jobTitleInsights: jest.fn(),
  } as unknown as jest.Mocked<SalaryInsightsService>;
}

describe(SalaryInsightsController.name, () => {
  it('returns country salary insights', async () => {
    const service = createService();
    service.countryInsights.mockResolvedValue({
      averageSalary: 95000,
      country: 'India',
      maxSalary: 200000,
      minSalary: 50000,
    });
    const controller = new SalaryInsightsController(service);

    await expect(controller.countryInsights('India')).resolves.toEqual({
      averageSalary: 95000,
      country: 'India',
      maxSalary: 200000,
      minSalary: 50000,
    });
    expect(service.countryInsights).toHaveBeenCalledWith('India');
  });

  it('returns job title salary insights', async () => {
    const service = createService();
    const query = { country: 'India', jobTitle: 'Software Engineer' };
    service.jobTitleInsights.mockResolvedValue({
      averageSalary: 120000,
      country: 'India',
      jobTitle: 'Software Engineer',
    });
    const controller = new SalaryInsightsController(service);

    await expect(controller.jobTitleInsights(query)).resolves.toEqual({
      averageSalary: 120000,
      country: 'India',
      jobTitle: 'Software Engineer',
    });
    expect(service.jobTitleInsights).toHaveBeenCalledWith(query);
  });

  it('returns dashboard metrics', async () => {
    const service = createService();
    service.dashboardMetrics.mockResolvedValue({
      highestPayingCountry: 'United States',
      highestPayingRole: 'Senior Software Engineer',
      medianSalary: 85000,
      salaryDistribution: [],
      totalEmployees: 10000,
    });
    const controller = new SalaryInsightsController(service);

    await expect(controller.dashboardMetrics()).resolves.toEqual({
      highestPayingCountry: 'United States',
      highestPayingRole: 'Senior Software Engineer',
      medianSalary: 85000,
      salaryDistribution: [],
      totalEmployees: 10000,
    });
  });
});
