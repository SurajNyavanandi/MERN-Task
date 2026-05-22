import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import InvoicePage from '../pages/InvoicePage';
import UserPage from '../pages/UserPage';

function PrivateRoute({ children }) {

  const token = localStorage.getItem('token');

  return token
    ? children
    : <Navigate to="/" />;
}

function AppRoutes() {

  return (
    <Routes>

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <InvoicePage />
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;