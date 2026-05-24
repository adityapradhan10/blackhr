import type { UseFormReturn } from 'react-hook-form';
import { Modal } from '../../../shared/ui/modal';
import type { EmployeeFormValues } from '../types';
import { EmployeeForm } from './employee-form';

type EmployeeFormDialogProps = {
  form: UseFormReturn<EmployeeFormValues>;
  isEditing: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function EmployeeFormDialog({
  form,
  isEditing,
  isOpen,
  isSubmitting,
  onCancel,
  onSubmit,
}: EmployeeFormDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      description={
        isEditing
          ? 'Update employee details and compensation information.'
          : 'Enter details to add a new employee to the organization.'
      }
      title={isEditing ? 'Edit Employee' : 'Add Employee'}
      width="lg"
    >
      <EmployeeForm
        form={form}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
