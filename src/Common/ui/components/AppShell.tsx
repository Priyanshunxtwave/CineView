import { Outlet } from 'react-router-dom';
import { Navbar } from './NavBar';

export const AppShell = () => (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col">
    <Navbar />
    <main className="flex-1 p-6 overflow-auto">
      <Outlet />
    </main>
  </div>
);