import { useState } from 'react';
import API from '../api/axios';

const TIMEZONES = [
  'UTC', 'GMT', 'IST', 'EST', 'CST', 'MST', 'PST',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 
  'Asia/Shanghai', 'Asia/Hong_Kong', 'Australia/Sydney'
];

export default function UserForm({ fetchUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await API.post('/api/auth/register', form);
      setForm({ username: '', email: '', password: '', role: 'USER', timezone: 'UTC' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        {showForm ? 'Cancel' : 'Add New User'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New User</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Username *"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Email *"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <input
              placeholder="Password *"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value="USER">User</option>
              <option value="UNIT_MANAGER">Unit Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded transition-colors"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      )}
    </div>
  );
}