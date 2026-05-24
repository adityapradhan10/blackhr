import { Button } from '@tremor/react';
import type { EmployeeResponse } from '@blackhr/shared-types';
import { Modal } from '../../../shared/ui/modal';

type EmployeeDeleteDialogProps = {
  employee: EmployeeResponse | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function EmployeeDeleteDialog({ employee, isDeleting, onCancel, onConfirm }: EmployeeDeleteDialogProps) {
  if (!employee) {
    return null;
  }

  return (
    <Modal
      description={`Are you sure you want to delete ${employee.fullName}? This action cannot be undone.`}
      title="Delete employee"
    >
      <div className="flex justify-end gap-2">
        <Button disabled={isDeleting} onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <button
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
          onClick={onConfirm}
          type="button"
        >
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    </Modal>
  );
}
