import { Button, Select, SelectItem, TextInput } from '@tremor/react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { EmployeeFormValues } from '../types';
import {
  EMPLOYMENT_TYPE_OPTIONS,
  FORM_COUNTRY_OPTIONS,
  FORM_DEPARTMENT_OPTIONS,
  FORM_JOB_TITLE_OPTIONS,
} from '../types';

type EmployeeFormProps = {
  form: UseFormReturn<EmployeeFormValues>;
  isEditing: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-red-600">{message}</p>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-sm font-medium text-slate-700">{children}</span>;
}

export function EmployeeForm({ form, isEditing, isSubmitting, onCancel, onSubmit }: EmployeeFormProps) {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      data-testid="employee-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Full Name</FieldLabel>
        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <TextInput
              aria-label="Full Name"
              error={Boolean(errors.fullName)}
              onValueChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Email</FieldLabel>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <TextInput
              aria-label="Email"
              error={Boolean(errors.email)}
              onValueChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="flex flex-col gap-1.5" data-testid="form-department">
        <FieldLabel>Department</FieldLabel>
        <Controller
          control={control}
          name="department"
          render={({ field }) => (
            <Select
              aria-label="Department"
              error={Boolean(errors.department)}
              errorMessage={errors.department?.message}
              onValueChange={field.onChange}
              placeholder="Select department"
              value={field.value}
            >
              {FORM_DEPARTMENT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <FieldError message={errors.department?.message} />
      </div>

      <div className="flex flex-col gap-1.5" data-testid="form-country">
        <FieldLabel>Country</FieldLabel>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Select
              aria-label="Country"
              error={Boolean(errors.country)}
              errorMessage={errors.country?.message}
              onValueChange={field.onChange}
              placeholder="Select country"
              value={field.value}
            >
              {FORM_COUNTRY_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <FieldError message={errors.country?.message} />
      </div>

      <div className="flex flex-col gap-1.5" data-testid="form-job-title">
        <FieldLabel>Job Title</FieldLabel>
        <Controller
          control={control}
          name="jobTitle"
          render={({ field }) => (
            <Select
              aria-label="Job Title"
              error={Boolean(errors.jobTitle)}
              errorMessage={errors.jobTitle?.message}
              onValueChange={field.onChange}
              placeholder="Select job title"
              value={field.value}
            >
              {FORM_JOB_TITLE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <FieldError message={errors.jobTitle?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Salary</FieldLabel>
        <Controller
          control={control}
          name="salary"
          render={({ field }) => (
            <TextInput
              aria-label="Salary"
              error={Boolean(errors.salary)}
              inputMode="numeric"
              onValueChange={(value: string) => field.onChange(Number(value))}
              type="number"
              value={String(field.value)}
            />
          )}
        />
        <FieldError message={errors.salary?.message} />
      </div>

      <div className="flex flex-col gap-1.5" data-testid="form-employment-type">
        <FieldLabel>Employment Type</FieldLabel>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select aria-label="Employment Type" onValueChange={field.onChange} value={field.value}>
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          )}
        />
        <FieldError message={errors.employmentType?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Joining Date</FieldLabel>
        <Controller
          control={control}
          name="joiningDate"
          render={({ field }) => (
            <TextInput
              aria-label="Joining Date"
              error={Boolean(errors.joiningDate)}
              onValueChange={field.onChange}
              type="date"
              value={field.value}
            />
          )}
        />
        <FieldError message={errors.joiningDate?.message} />
      </div>

      <div className="col-span-full flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Button disabled={isSubmitting} onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
          {isEditing ? 'Save Changes' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
}
