import type { UseFormReturn } from 'react-hook-form';
import { AlertBanner } from '../../../shared/ui/alert-banner';
import { Modal } from '../../../shared/ui/modal';
import type { EmployeeFormValues } from '../types';
import { EmployeeForm } from './employee-form';

type EmployeeFormDialogProps = {
  errorMessage?: string | null;
  form: UseFormReturn<EmployeeFormValues>;
  isEditing: boolean;
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export function EmployeeFormDialog({
  errorMessage,
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
      {errorMessage ? (
        <div className="mb-4">
          <AlertBanner>{errorMessage}</AlertBanner>
        </div>
      ) : null}
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
