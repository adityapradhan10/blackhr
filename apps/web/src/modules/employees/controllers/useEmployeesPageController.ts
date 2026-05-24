import type { EmployeeQuery, EmployeeResponse, EmployeeSortBy, EmployeeSortOrder } from '@blackhr/shared-types';
import { useEffect, useMemo, useState } from 'react';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';
import { useEmployees } from '../hooks/useEmployees';
import { EMPTY_EMPLOYEE_FILTERS, type EmployeeFilters } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const SEARCH_DEBOUNCE_MS = 300;

export function useEmployeesPageController() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>(EMPTY_EMPLOYEE_FILTERS);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [sortBy, setSortBy] = useState<EmployeeSortBy | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<EmployeeSortOrder>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeResponse | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeResponse | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const deleteEmployee = useDeleteEmployee();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(DEFAULT_PAGE);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const query = useMemo<EmployeeQuery>(() => {
    const nextQuery: EmployeeQuery = {
      limit: DEFAULT_LIMIT,
      page,
    };

    if (debouncedSearch.trim()) {
      nextQuery.search = debouncedSearch.trim();
    }

    if (filters.country.trim()) {
      nextQuery.country = filters.country.trim();
    }

    if (filters.department.trim()) {
      nextQuery.department = filters.department.trim();
    }

    if (filters.jobTitle.trim()) {
      nextQuery.jobTitle = filters.jobTitle.trim();
    }

    if (sortBy) {
      nextQuery.sortBy = sortBy;
      nextQuery.sortOrder = sortOrder;
    }

    return nextQuery;
  }, [debouncedSearch, filters.country, filters.department, filters.jobTitle, page, sortBy, sortOrder]);

  const employeesQuery = useEmployees(query);

  const updateFilter = (key: keyof EmployeeFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(DEFAULT_PAGE);
  };

  const handleSort = (column: EmployeeSortBy) => {
    if (sortBy === column) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortOrder('asc');
    setPage(DEFAULT_PAGE);
  };

  const openCreateForm = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const openEditForm = (employee: EmployeeResponse) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingEmployee(null);
    setIsFormOpen(false);
  };

  const openDeleteDialog = (employee: EmployeeResponse) => {
    setDeletingEmployee(employee);
  };

  const closeDeleteDialog = () => {
    if (!deleteEmployee.isPending) {
      setDeletingEmployee(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingEmployee) {
      return;
    }

    await deleteEmployee.mutateAsync(deletingEmployee.id);
    setDeletingEmployee(null);
    setFeedbackMessage('Employee deleted successfully.');
  };

  const handleFormSuccess = (message: string) => {
    setFeedbackMessage(message);
  };

  return {
    closeDeleteDialog,
    closeForm,
    confirmDelete,
    deletingEmployee,
    editingEmployee,
    employees: employeesQuery.data?.data ?? [],
    error: employeesQuery.error,
    feedbackMessage,
    filters,
    handleFormSuccess,
    handleSort,
    isDeleting: deleteEmployee.isPending,
    isError: employeesQuery.isError,
    isFormOpen,
    isLoading: employeesQuery.isLoading,
    openCreateForm,
    openDeleteDialog,
    openEditForm,
    page,
    search,
    setPage,
    setSearch,
    sortBy,
    sortOrder,
    totalPages: employeesQuery.data?.meta.totalPages ?? 0,
    updateFilter,
  };
}

export type EmployeesPageController = ReturnType<typeof useEmployeesPageController>;
