import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateEmployeeRequest, EmploymentType } from '@blackhr/shared-types';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateEmployeeDto implements CreateEmployeeRequest {
  @ApiProperty({ example: 'Aarav Sharma', type: String })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'aarav.sharma@blackhr.example', type: String })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 120000, minimum: 1, type: Number })
  @IsNumber()
  @Min(1)
  salary!: number;

  @ApiProperty({ example: 'India', type: String })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({ example: 'Software Engineer', type: String })
  @IsNotEmpty()
  @IsString()
  jobTitle!: string;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z', format: 'date-time', type: String })
  @IsDate()
  @Type(() => Date)
  joiningDate!: Date;

  @ApiPropertyOptional({ example: 'Engineering', type: String })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'FULL_TIME', type: String })
  @IsOptional()
  @IsString()
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ example: 'USD', type: String })
  @IsOptional()
  @IsString()
  currency?: string;
}
