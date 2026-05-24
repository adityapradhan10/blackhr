import { Module } from '@nestjs/common';
import { SalaryInsightsController } from './controllers/salary-insights.controller';
import {
  SALARY_INSIGHTS_REPOSITORY,
  SalaryInsightsRepository,
} from './repositories/salary-insights.repository';
import { SalaryInsightsService } from './services/salary-insights.service';

@Module({
  controllers: [SalaryInsightsController],
  providers: [
    SalaryInsightsService,
    {
      provide: SALARY_INSIGHTS_REPOSITORY,
      useClass: SalaryInsightsRepository,
    },
  ],
})
export class SalaryInsightsModule {}
