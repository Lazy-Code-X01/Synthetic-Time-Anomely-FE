import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import History from './pages/History';
import DashboardAppPage from './pages/DashboardAppPage';
import RegisterPage from './pages/RegisterPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// ----------------------------------------------------------------------
import PrivateRoute from './PrivateRoute';

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <PrivateRoute />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'history', element: <History /> },
        { path: 'profile', element: <ProfileSettingsPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
