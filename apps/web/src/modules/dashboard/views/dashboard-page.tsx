import type { DashboardPageController } from '../controllers/useDashboardPageController';
import { useDashboardPageController } from '../controllers/useDashboardPageController';
import { PageHeader } from '../../../shared/ui/page-header';
import { CountryInsightCard } from './country-insight-card';
import { DashboardKpis } from './dashboard-kpis';
import { JobTitleInsight } from './job-title-insight';
import { SalaryCountryChart } from './salary-country-chart';
import { SalaryDistributionChart } from './salary-distribution-chart';

function DashboardContent({ controller }: { controller: DashboardPageController }) {
  return (
    <>
      <DashboardKpis display={controller.display} isLoading={controller.isLoading} />

      <div className="mb-8 grid gap-6 xl:grid-cols-2">
        <CountryInsightCard
          countryOptions={controller.countryOptions}
          insight={controller.countryInsight}
          isError={controller.isCountryInsightError}
          isLoading={controller.isCountryInsightLoading}
          onCountryChange={controller.setSelectedCountry}
          selectedCountry={controller.selectedCountry}
        />

        <JobTitleInsight
          countryOptions={controller.countryOptions}
          insight={controller.jobTitleInsight}
          isError={controller.isJobTitleInsightError}
          isLoading={controller.isJobTitleInsightLoading}
          jobTitleOptions={controller.jobTitleOptions}
          onCountryChange={controller.setSelectedCountry}
          onJobTitleChange={controller.setSelectedJobTitle}
          selectedCountry={controller.selectedCountry}
          selectedJobTitle={controller.selectedJobTitle}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SalaryCountryChart
          data={controller.countryChartData}
          isEmpty={controller.countryChartData.length === 0}
          isError={controller.isCountryChartError}
          isLoading={controller.isCountryChartLoading}
        />

        <SalaryDistributionChart
          data={controller.departmentDistribution}
          isEmpty={controller.isDepartmentChartEmpty}
          isLoading={controller.isLoading}
        />
      </div>
    </>
  );
}

export function DashboardPage() {
  const controller = useDashboardPageController();

  if (controller.isLoading) {
    return (
      <section>
        <PageHeader
          description="Organization-wide salary metrics and workforce insights"
          title="Dashboard"
        />
        <p aria-label="Loading dashboard" className="text-sm text-slate-500" role="status">
          Loading dashboard...
        </p>
      </section>
    );
  }

  if (controller.isError) {
    return (
      <section>
        <PageHeader
          description="Organization-wide salary metrics and workforce insights"
          title="Dashboard"
        />
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          Unable to load dashboard metrics. Please try again.
        </p>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        description="Organization-wide salary metrics and workforce insights"
        title="Dashboard"
      />

      <DashboardContent controller={controller} />
    </section>
  );
}
