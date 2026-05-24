import type { EmployeeResponse, EmployeeSortBy } from '@blackhr/shared-types';
import { Badge, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';
import { PanelCard } from '../../../shared/ui/panel-card';
import { LoadingMessage } from '../../../shared/ui/loading-message';
import { formatCurrency } from '../../../shared/utils/formatters';
import { EMPLOYMENT_TYPE_LABELS } from '../types';

type EmployeeTableProps = {
  employees: EmployeeResponse[];
  isLoading: boolean;
  onDelete?: (employee: EmployeeResponse) => void;
  onEdit?: (employee: EmployeeResponse) => void;
  onSort?: (column: EmployeeSortBy) => void;
  sortBy?: EmployeeSortBy;
  sortOrder?: 'asc' | 'desc';
};

function SortIcon({ active, order }: { active: boolean; order?: 'asc' | 'desc' }) {
  const inactiveClass = active
    ? 'text-indigo-600 opacity-100'
    : 'text-slate-400 opacity-0 group-hover:opacity-100';

  return (
    <span aria-hidden="true" className={`ml-1 inline-flex flex-col ${inactiveClass} transition-opacity`}>
      <svg
        className={`h-2.5 w-2.5 ${active && order === 'desc' ? 'opacity-30' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 6l-4 4h8l-4-4z" transform="rotate(180 10 10)" />
      </svg>
      <svg
        className={`h-2.5 w-2.5 -mt-1 ${active && order === 'asc' ? 'opacity-30' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 6l-4 4h8l-4-4z" />
      </svg>
    </span>
  );
}

type SortableColumnHeaderProps = {
  column: EmployeeSortBy;
  label: string;
  onSort?: (column: EmployeeSortBy) => void;
  sortBy?: EmployeeSortBy;
  sortOrder?: 'asc' | 'desc';
};

function SortableColumnHeader({ column, label, onSort, sortBy, sortOrder }: SortableColumnHeaderProps) {
  const isActive = sortBy === column;
  const canSort = Boolean(onSort);

  return (
    <button
      aria-label={`Sort by ${label}`}
      aria-sort={isActive ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={
        canSort
          ? 'group -mx-2 inline-flex w-[calc(100%+1rem)] cursor-pointer items-center rounded-md px-2 py-1.5 text-left font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900'
          : 'inline-flex items-center font-medium text-slate-600'
      }
      disabled={!canSort}
      onClick={() => onSort?.(column)}
      type="button"
    >
      <span className={isActive ? 'text-slate-900' : undefined}>{label}</span>
      {canSort ? <SortIcon active={isActive} order={sortOrder} /> : null}
    </button>
  );
}

export function EmployeeTable({
  employees,
  isLoading,
  onDelete,
  onEdit,
  onSort,
  sortBy,
  sortOrder,
}: EmployeeTableProps) {
  if (isLoading) {
    return (
      <PanelCard>
        <LoadingMessage aria-label="Loading employees">Loading employees...</LoadingMessage>
      </PanelCard>
    );
  }

  if (employees.length === 0) {
    return (
      <PanelCard>
        <p className="text-sm text-slate-500">No employees found.</p>
      </PanelCard>
    );
  }

  return (
    <PanelCard>
      <div className="-mx-6 overflow-x-auto px-6">
        <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Employee ID</TableHeaderCell>
            <TableHeaderCell>
              <SortableColumnHeader column="fullName" label="Name" onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
            </TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>
              <SortableColumnHeader column="country" label="Country" onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableColumnHeader column="jobTitle" label="Job Title" onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
            </TableHeaderCell>
            <TableHeaderCell>
              <SortableColumnHeader column="salary" label="Salary" onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
            </TableHeaderCell>
            <TableHeaderCell>Employment Type</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.employeeId}</TableCell>
              <TableCell>{employee.fullName}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.country}</TableCell>
              <TableCell>{employee.jobTitle}</TableCell>
              <TableCell>{formatCurrency(employee.salary, employee.currency)}</TableCell>
              <TableCell>
                <Badge color="blue">{EMPLOYMENT_TYPE_LABELS[employee.employmentType]}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {onEdit ? (
                    <button aria-label={`Edit ${employee.fullName}`} onClick={() => onEdit(employee)} type="button">
                      Edit
                    </button>
                  ) : null}
                  {onDelete ? (
                    <button aria-label={`Delete ${employee.fullName}`} onClick={() => onDelete(employee)} type="button">
                      Delete
                    </button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </PanelCard>
  );
}
