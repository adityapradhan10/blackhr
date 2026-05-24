import type {
  CreateEmployeeRequest,
  EmployeeListResponse,
  EmployeeQuery,
  EmployeeResponse,
  UpdateEmployeeRequest,
} from '@blackhr/shared-types';
import { api } from '../../../shared/services/api';

export const employeeApi = {
  async createEmployee(input: CreateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await api.post<EmployeeResponse>('/employees', input);

    return response.data;
  },

  async deleteEmployee(id: string): Promise<EmployeeResponse> {
    const response = await api.delete<EmployeeResponse>(`/employees/${id}`);

    return response.data;
  },

  async getEmployee(id: string): Promise<EmployeeResponse> {
    const response = await api.get<EmployeeResponse>(`/employees/${id}`);

    return response.data;
  },

  async listEmployees(query: EmployeeQuery = {}): Promise<EmployeeListResponse> {
    const response = await api.get<EmployeeListResponse>('/employees', { params: query });

    return response.data;
  },

  async updateEmployee(id: string, input: UpdateEmployeeRequest): Promise<EmployeeResponse> {
    const response = await api.patch<EmployeeResponse>(`/employees/${id}`, input);

    return response.data;
  },
};
