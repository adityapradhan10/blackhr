import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SalaryInsightsService } from '../../../../src/modules/salary-insights/services/salary-insights.service';
import type { SalaryInsightsRepositoryPort } from '../../../../src/modules/salary-insights/repositories/salary-insights.repository';

function createRepository(): jest.Mocked<SalaryInsightsRepositoryPort> {
  return {
    findCountrySalaryMetrics: jest.fn(),
    findDashboardMetrics: jest.fn(),
    findJobTitleAverageSalary: jest.fn(),
  };
}

describe(SalaryInsightsService.name, () => {
  describe('countryInsights', () => {
    it('returns min salary', async () => {
      const repository = createRepository();
      repository.findCountrySalaryMetrics.mockResolvedValue({
        averageSalary: 95000,
        count: 3,
        maxSalary: 200000,
        minSalary: 50000,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.countryInsights('India')).resolves.toEqual(
        expect.objectContaining({
          country: 'India',
          minSalary: 50000,
        }),
      );
    });

    it('returns max salary', async () => {
      const repository = createRepository();
      repository.findCountrySalaryMetrics.mockResolvedValue({
        averageSalary: 95000,
        count: 3,
        maxSalary: 200000,
        minSalary: 50000,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.countryInsights('India')).resolves.toEqual(
        expect.objectContaining({
          country: 'India',
          maxSalary: 200000,
        }),
      );
    });

    it('returns average salary', async () => {
      const repository = createRepository();
      repository.findCountrySalaryMetrics.mockResolvedValue({
        averageSalary: 95000.4,
        count: 3,
        maxSalary: 200000,
        minSalary: 50000,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.countryInsights('India')).resolves.toEqual(
        expect.objectContaining({
          averageSalary: 95000,
          country: 'India',
        }),
      );
    });

    it('handles missing country', async () => {
      const service = new SalaryInsightsService(createRepository());

      await expect(service.countryInsights('')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('handles empty results', async () => {
      const repository = createRepository();
      repository.findCountrySalaryMetrics.mockResolvedValue({
        averageSalary: null,
        count: 0,
        maxSalary: null,
        minSalary: null,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.countryInsights('Atlantis')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('jobTitleInsights', () => {
    it('returns average salary by role', async () => {
      const repository = createRepository();
      repository.findJobTitleAverageSalary.mockResolvedValue({
        averageSalary: 120000.6,
        count: 2,
      });
      const service = new SalaryInsightsService(repository);

      await expect(
        service.jobTitleInsights({ country: 'India', jobTitle: 'Software Engineer' }),
      ).resolves.toEqual({
        averageSalary: 120001,
        country: 'India',
        jobTitle: 'Software Engineer',
      });
    });

    it('handles empty results', async () => {
      const repository = createRepository();
      repository.findJobTitleAverageSalary.mockResolvedValue({
        averageSalary: null,
        count: 0,
      });
      const service = new SalaryInsightsService(repository);

      await expect(
        service.jobTitleInsights({ country: 'India', jobTitle: 'Underwater Welder' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('dashboardMetrics', () => {
    it('returns total employees', async () => {
      const repository = createRepository();
      repository.findDashboardMetrics.mockResolvedValue({
        highestPayingCountry: 'United States',
        highestPayingRole: 'Senior Software Engineer',
        medianSalary: 85000,
        salaryDistribution: [
          {
            count: 4,
            label: '50000-99999',
          },
          {
            count: 6,
            label: '100000-149999',
          },
        ],
        totalEmployees: 10,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.dashboardMetrics()).resolves.toEqual(expect.objectContaining({ totalEmployees: 10 }));
    });

    it('returns highest paying country', async () => {
      const repository = createRepository();
      repository.findDashboardMetrics.mockResolvedValue({
        highestPayingCountry: 'United States',
        highestPayingRole: 'Senior Software Engineer',
        medianSalary: 85000,
        salaryDistribution: [],
        totalEmployees: 10,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.dashboardMetrics()).resolves.toEqual(
        expect.objectContaining({ highestPayingCountry: 'United States' }),
      );
    });

    it('returns highest paying role', async () => {
      const repository = createRepository();
      repository.findDashboardMetrics.mockResolvedValue({
        highestPayingCountry: 'United States',
        highestPayingRole: 'Senior Software Engineer',
        medianSalary: 85000,
        salaryDistribution: [],
        totalEmployees: 10,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.dashboardMetrics()).resolves.toEqual(
        expect.objectContaining({ highestPayingRole: 'Senior Software Engineer' }),
      );
    });

    it('returns median salary', async () => {
      const repository = createRepository();
      repository.findDashboardMetrics.mockResolvedValue({
        highestPayingCountry: 'United States',
        highestPayingRole: 'Senior Software Engineer',
        medianSalary: 85000,
        salaryDistribution: [],
        totalEmployees: 10,
      });
      const service = new SalaryInsightsService(repository);

      await expect(service.dashboardMetrics()).resolves.toEqual(expect.objectContaining({ medianSalary: 85000 }));
    });
  });
});
