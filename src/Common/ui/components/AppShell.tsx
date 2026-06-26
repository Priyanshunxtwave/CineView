import { Outlet } from 'react-router-dom';
import { Navbar } from './NavBar';

export const AppShell = () => {
  return (
    // This locks the entire background to a deep premium slate color globally
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />
      {/* Added pt-24 so content doesn't hide behind the new floating Navbar */}
      <main className="w-full pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
};