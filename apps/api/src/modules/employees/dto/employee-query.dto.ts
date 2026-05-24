import { ApiPropertyOptional } from '@nestjs/swagger';
import type { EmployeeQuery, EmployeeSortBy, EmployeeSortOrder } from '@blackhr/shared-types';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORTABLE_FIELDS = ['fullName', 'salary', 'country', 'jobTitle', 'createdAt', 'joiningDate'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

export class EmployeeQueryDto implements EmployeeQuery {
  @ApiPropertyOptional({ default: 1, minimum: 1, type: Number })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 20, maximum: 100, minimum: 1, type: Number })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ example: 'sharma', type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'India', type: String })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Engineering', type: String })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ example: 'Software Engineer', type: String })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: EmployeeSortBy;

  @ApiPropertyOptional({ enum: SORT_ORDERS })
  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: EmployeeSortOrder;
}
