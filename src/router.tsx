import './index.css';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './Common/ui/components/AppShell';
import { ProtectedRoute } from './Common/ui/components/ProtectedRoute';
import { LoginPage } from './Auth/ui/pages/LoginPage';
import { HomePage } from './Movies/ui/pages/HomePage';
import { SearchPage } from './Search/ui/pages/SearchPage';
import { TVShowIndexRedirect } from './Movies/ui/pages/TVShowIndexRedirect';
import { SettingsPage } from './Settings/ui/pages/SettingsPage';

// Import the new Detail Pages
import { MovieDetailPage } from './Movies/ui/pages/MovieDetailPage';
import { TVShowDetailPage } from './Movies/ui/pages/TVShowDetailPage';
import { SeasonDetailPage } from './Movies/ui/pages/SeasonDetailPage';

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <div className="p-4 text-red-500 bg-gray-900 min-h-screen flex items-center justify-center">404 - Route Not Found</div>,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: 'settings', element: <SettingsPage /> },

      // Movie Detail Route (Note: changed from "movies/:id" to "movie/:id" for cleaner RESTful URLs)
      { path: "movie/:id", element: <MovieDetailPage /> },
      
      // Nested TV Show Routes
      {
        path: 'tv/:id',
        element: <TVShowDetailPage />,
        children: [
          {
            index: true,
            element: <TVShowIndexRedirect />, // small helper component
          },
          { path: 'season/:seasonNum', element: <SeasonDetailPage /> },
        ],
      },
      
      // Future Milestone Placeholders
      { path: "watchlist", element: <div>Watchlist Placeholder</div> },
      { path: "lists", element: <div>Lists Placeholder</div> },
      { path: "lists/:id", element: <div>List Detail Placeholder</div> },
      { path: "settings", element: <div>SettingsPage</div> },
    ],
  },
]);