import type { DashboardPageController } from '../controllers/useDashboardPageController';
import { useDashboardPageController } from '../controllers/useDashboardPageController';
import { AlertBanner } from '../../../shared/ui/alert-banner';
import { LoadingMessage } from '../../../shared/ui/loading-message';
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
        <LoadingMessage aria-label="Loading dashboard">Loading dashboard...</LoadingMessage>
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
        <AlertBanner>Unable to load dashboard metrics. Please try again.</AlertBanner>
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
