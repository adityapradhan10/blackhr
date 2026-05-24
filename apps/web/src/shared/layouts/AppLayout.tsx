import { NavLink, Outlet } from 'react-router-dom';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'font-semibold text-slate-950' : 'text-slate-600 hover:text-slate-950';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="w-56 border-r border-slate-200 bg-white p-6">
          <p className="mb-6 text-lg font-semibold">BlackHR</p>
          <nav className="flex flex-col gap-3">
            <NavLink className={navLinkClassName} to="/dashboard">
              Dashboard
            </NavLink>
            <NavLink className={navLinkClassName} to="/employees">
              Employees
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
