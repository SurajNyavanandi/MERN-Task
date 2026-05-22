import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InvoiceDashboard from "./pages/InvoiceDashboard";
import UserPage from "./pages/UserPage";
import AdminGroups from "./pages/AdminGroups";
import UnitGroups from "./pages/UnitGroups";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - Available to all authenticated users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <InvoiceDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/invoices" element={
          <ProtectedRoute>
            <InvoiceDashboard />
          </ProtectedRoute>
        } />
        
        {/* User Management - Role-based access controlled inside component */}
        <Route path="/users" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />
        
        {/* SUPER_ADMIN only routes */}
        <Route path="/admin-groups" element={
          <ProtectedRoute>
            <AdminGroups />
          </ProtectedRoute>
        } />
        
        {/* ADMIN only routes */}
        <Route path="/unit-groups" element={
          <ProtectedRoute>
            <UnitGroups />
          </ProtectedRoute>
        } />
        
        {/* Default route */}
        <Route path="/" element={
          <ProtectedRoute>
            <InvoiceDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}