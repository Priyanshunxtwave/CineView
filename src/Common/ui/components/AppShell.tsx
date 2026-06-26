import { Outlet } from 'react-router-dom';
import { Navbar } from './NavBar';

export const AppShell = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      <main className="w-full pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
};