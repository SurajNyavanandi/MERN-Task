import { Routes, Route } from 'react-router-dom';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import InvoicePage from '../pages/InvoicePage';
import UserPage from '../pages/UserPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/invoices" element={<InvoicePage />} />
      <Route path="/users" element={<UserPage />} />
    </Routes>
  );
}

export default AppRoutes;