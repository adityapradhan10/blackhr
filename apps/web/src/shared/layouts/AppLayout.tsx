import { NavLink, Outlet } from 'react-router-dom';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  ].join(' ');

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-slate-200/80 bg-white lg:w-64 lg:border-r lg:border-b-0">
          <div className="border-b border-slate-100 px-4 py-4 lg:px-6 lg:py-5">
            <p className="text-lg font-bold tracking-tight text-slate-900">BlackHR</p>
            <p className="mt-0.5 text-xs text-slate-500">Salary management</p>
          </div>

          <nav aria-label="Main navigation" className="flex gap-1 p-3 lg:flex-col lg:p-4">
            <NavLink className={navLinkClassName} to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClassName} to="/employees">
              Employees
            </NavLink>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
