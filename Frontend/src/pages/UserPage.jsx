import { useEffect, useState } from 'react';
import API from '../api/axios';
import MainLayout from '../layouts/MainLayout';
import UserForm from '../components/UserForm';
import UserTable from '../components/UserTable';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(`/api/users?role=${roleFilter}`);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await API.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600 mb-6">Manage system users and their roles</p>
        
        <UserForm fetchUsers={fetchUsers} />
        
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
          <select
            className="border p-3 rounded w-64"
            onChange={(e) => setRoleFilter(e.target.value)}
            value={roleFilter}
          >
            <option value="">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="UNIT_MANAGER">UNIT_MANAGER</option>
            <option value="USER">USER</option>
          </select>
        </div>

        {users.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg">No users found. Click "Add New User" to create one.</p>
          </div>
        ) : (
          <UserTable users={users} deleteUser={deleteUser} fetchUsers={fetchUsers} />
        )}
      </div>
    </MainLayout>
  );
}

export default UserPage;