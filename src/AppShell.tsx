import { Outlet } from 'react-router-dom';

export const AppShell = () => (
  <div className="min-h-screen bg-gray-900 text-white">
    <header className="p-4 bg-gray-800 shadow-md">CineView Shell</header>
    <main className="p-4">
      <Outlet />
    </main>
  </div>
);