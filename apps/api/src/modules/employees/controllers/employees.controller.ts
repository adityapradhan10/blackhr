import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { EmployeeQueryDto } from '../dto/employee-query.dto';
import { EmployeeResponseDto, PaginatedEmployeesResponseDto } from '../dto/employee-response.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import type { EmployeeRecord } from '../repositories/employees.repository';
import { EmployeesService, type PaginatedEmployees } from '../services/employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiBody({ type: CreateEmployeeDto })
  @ApiCreatedResponse({ description: 'Employee created successfully', type: EmployeeResponseDto })
  @ApiConflictResponse({ description: 'Employee email already exists' })
  createEmployee(@Body() dto: CreateEmployeeDto): Promise<EmployeeRecord> {
    return this.employeesService.createEmployee(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'Paginated employees returned successfully', type: PaginatedEmployeesResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiQuery({ name: 'jobTitle', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: EmployeeQueryDto): Promise<PaginatedEmployees> {
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Employee returned successfully', type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  findById(@Param('id') id: string): Promise<EmployeeRecord> {
    return this.employeesService.findById(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOkResponse({ description: 'Employee updated successfully', type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto): Promise<EmployeeRecord> {
    return this.employeesService.updateEmployee(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Employee deleted successfully', type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  deleteEmployee(@Param('id') id: string): Promise<EmployeeRecord> {
    return this.employeesService.deleteEmployee(id);
  }
}
