import { useState } from 'react';
import API from '../api/axios';

export default function UserTable({ users, deleteUser, fetchUsers }) {
  const [updatingRole, setUpdatingRole] = useState(null);

  const updateRole = async (userId, newRole) => {
    try {
      await API.put(`/api/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Role update failed:', error);
      alert('Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="p-4">User ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Timezone</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-center">{user.userId}</td>
              <td className="p-4 text-center">{user.username}</td>
              <td className="p-4 text-center">{user.email}</td>
              <td className="p-4 text-center">
                {updatingRole === user._id ? (
                  <select
                    defaultValue={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="border rounded px-2 py-1"
                    autoFocus
                  >
                    <option value="USER">USER</option>
                    <option value="UNIT_MANAGER">UNIT_MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 rounded">{user.role}</span>
                )}
              </td>
              <td className="p-4 text-center">{user.timezone || 'UTC'}</td>
              <td className="p-4 text-center space-x-2">
                <button
                  onClick={() => setUpdatingRole(user._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit Role
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}