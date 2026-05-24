import type { EmployeeResponse } from '@blackhr/shared-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getApiErrorMessage } from '../../../shared/utils/api-errors';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';
import { employeeFormSchema, type EmployeeFormValues } from '../types';

type UseEmployeeFormControllerOptions = {
  employee?: EmployeeResponse | null;
  onClose: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

function toFormValues(employee?: EmployeeResponse | null): EmployeeFormValues {
  if (!employee) {
    return {
      country: '',
      department: '',
      email: '',
      employmentType: 'FULL_TIME',
      fullName: '',
      jobTitle: '',
      joiningDate: '',
      salary: 0,
    };
  }

  return {
    country: employee.country,
    department: employee.department,
    email: employee.email,
    employmentType: employee.employmentType,
    fullName: employee.fullName,
    jobTitle: employee.jobTitle,
    joiningDate: employee.joiningDate.slice(0, 10),
    salary: employee.salary,
  };
}

export function useEmployeeFormController({ employee, onClose, onError, onSuccess }: UseEmployeeFormControllerOptions) {
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const isEditing = Boolean(employee);

  const form = useForm<EmployeeFormValues>({
    defaultValues: toFormValues(employee),
    resolver: zodResolver(employeeFormSchema),
  });

  useEffect(() => {
    form.reset(toFormValues(employee));
  }, [employee, form]);

  const submit = form.handleSubmit(async (values) => {
    try {
      if (isEditing && employee) {
        await updateEmployee.mutateAsync({
          id: employee.id,
          input: values,
        });
        onSuccess('Employee updated successfully.');
      } else {
        await createEmployee.mutateAsync(values);
        onSuccess('Employee created successfully.');
      }

      onClose();
    } catch (error) {
      onError(getApiErrorMessage(error, 'Unable to save employee. Please try again.'));
    }
  });

  return {
    form,
    isEditing,
    isSubmitting: createEmployee.isPending || updateEmployee.isPending,
    submit,
  };
}
