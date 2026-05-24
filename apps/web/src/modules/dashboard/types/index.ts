export {
  COUNTRY_OPTIONS,
  DEPARTMENT_OPTIONS,
  JOB_TITLE_OPTIONS,
} from '../../../shared/constants/workforce-options';

export type DashboardDisplay = {
  highestPayingCountry: string;
  highestPayingRole: string;
  medianSalary: string;
  totalEmployees: string;
};

export { formatCount, formatCurrency, formatLabel } from '../../../shared/utils/formatters';
