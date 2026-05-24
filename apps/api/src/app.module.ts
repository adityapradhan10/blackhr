import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './common/health.controller';
import configuration from './config/configuration';
import { validateEnvironment } from './config/env.schema';
import { PrismaModule } from './database/prisma.module';
import { EmployeesModule } from './modules/employees/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnvironment,
    }),
    EmployeesModule,
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
