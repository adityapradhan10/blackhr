import { Module } from '@nestjs/common';
import { EmployeesController } from './controllers/employees.controller';
import { EMPLOYEES_REPOSITORY, EmployeesRepository } from './repositories/employees.repository';
import { EmployeesService } from './services/employees.service';

@Module({
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    {
      provide: EMPLOYEES_REPOSITORY,
      useClass: EmployeesRepository,
    },
  ],
})
export class EmployeesModule {}
