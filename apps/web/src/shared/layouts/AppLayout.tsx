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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-lg font-bold tracking-tight text-slate-900">BlackHR</p>
            <p className="mt-0.5 text-xs text-slate-500">Salary management</p>
          </div>

          <nav aria-label="Main navigation" className="flex flex-col gap-1 p-4">
            <NavLink className={navLinkClassName} to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClassName} to="/employees">
              Employees
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
