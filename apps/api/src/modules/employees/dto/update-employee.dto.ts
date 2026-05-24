import { PartialType } from '@nestjs/swagger';
import type { UpdateEmployeeRequest } from '@blackhr/shared-types';
import { CreateEmployeeDto } from './create-employee.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) implements UpdateEmployeeRequest {}
