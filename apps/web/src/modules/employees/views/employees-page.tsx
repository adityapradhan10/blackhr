import { Button } from '@tremor/react';
import { useEmployeeFormController } from '../controllers/useEmployeeFormController';
import { useEmployeesPageController } from '../controllers/useEmployeesPageController';
import { AlertBanner } from '../../../shared/ui/alert-banner';
import { PageHeader } from '../../../shared/ui/page-header';
import { EmployeeDeleteDialog } from './employee-delete-dialog';
import { EmployeeFiltersPanel } from './employee-filters';
import { EmployeeFormDialog } from './employee-form-dialog';
import { EmployeeTable } from './employee-table';

export function EmployeesPage() {
  const controller = useEmployeesPageController();
  const formController = useEmployeeFormController({
    employee: controller.editingEmployee,
    onClose: controller.closeForm,
    onError: controller.handleFormError,
    onSuccess: controller.handleFormSuccess,
  });

  if (controller.isError) {
    return (
      <section>
        <PageHeader description="Manage employee records, compensation, and employment details" title="Employees" />
        <AlertBanner>Unable to load employees. Please try again.</AlertBanner>
      </section>
    );
  }

  return (
    <section>
      <PageHeader
        actions={
          <Button className="shrink-0" onClick={controller.openCreateForm}>
            Add Employee
          </Button>
        }
        description="Manage employee records, compensation, and employment details"
        title="Employees"
      />

      {controller.feedbackMessage ? (
        <p className="mb-4 rounded-md bg-emerald-50 px-4 py-2 text-emerald-800" role="status">
          {controller.feedbackMessage}
        </p>
      ) : null}

      <EmployeeFiltersPanel
        filters={controller.filters}
        onFilterChange={controller.updateFilter}
        onSearchChange={controller.setSearch}
        search={controller.search}
      />

      <EmployeeFormDialog
        errorMessage={controller.formError}
        form={formController.form}
        isEditing={formController.isEditing}
        isOpen={controller.isFormOpen}
        isSubmitting={formController.isSubmitting}
        onCancel={controller.closeForm}
        onSubmit={formController.submit}
      />

      <EmployeeTable
        employees={controller.employees}
        isLoading={controller.isLoading}
        onDelete={controller.openDeleteDialog}
        onEdit={controller.openEditForm}
        onSort={controller.handleSort}
        sortBy={controller.sortBy}
        sortOrder={controller.sortOrder}
      />

      {controller.totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            disabled={controller.page <= 1}
            onClick={() => controller.setPage(controller.page - 1)}
            type="button"
            variant="secondary"
          >
            Previous
          </Button>
          <span>
            Page {controller.page} of {controller.totalPages}
          </span>
          <Button
            disabled={controller.page >= controller.totalPages}
            onClick={() => controller.setPage(controller.page + 1)}
            type="button"
            variant="secondary"
          >
            Next
          </Button>
        </div>
      ) : null}

      <EmployeeDeleteDialog
        employee={controller.deletingEmployee}
        isDeleting={controller.isDeleting}
        onCancel={controller.closeDeleteDialog}
        onConfirm={controller.confirmDelete}
      />
    </section>
  );
}
