import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <div className="p-4 text-red-500">404 - Route Not Found</div>,
    children: [
      { index: true, element: <div>Home Page Placeholder</div> },
      { path: "login", element: <div>Login Page Placeholder</div> },
      { path: "search", element: <div>Search Page Placeholder</div> },
      { path: "movies/:id", element: <div>Movie Detail Placeholder</div> },
      { path: "tv/:id", element: <div>TV Detail Placeholder</div> },
      { path: "tv/:id/season/:seasonNumber", element: <div>Season Detail Placeholder</div> },
      { path: "watchlist", element: <div>Watchlist Placeholder</div> },
      { path: "lists", element: <div>Lists Placeholder</div> },
      { path: "lists/:id", element: <div>List Detail Placeholder</div> },
      { path: "settings", element: <div>Settings Placeholder</div> },
    ],
  },
]);