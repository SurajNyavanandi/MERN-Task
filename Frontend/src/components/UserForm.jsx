import { useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const TIMEZONES = [
  'UTC', 'GMT', 'IST', 'EST', 'CST', 'MST', 'PST',
  'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 
  'Asia/Shanghai', 'Asia/Hong_Kong', 'Australia/Sydney'
];

export default function UserForm({ fetchUsers }) {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set default role based on logged-in user's role
  const getDefaultRole = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN': return 'ADMIN';
      case 'ADMIN': return 'UNIT_MANAGER';
      case 'UNIT_MANAGER': return 'USER';
      default: return 'USER';
    }
  };

  // Get available roles based on logged-in user's role
  const getAvailableRoles = () => {
    switch (user?.role) {
      case 'SUPER_ADMIN':
        return [{ value: 'ADMIN', label: 'Admin' }];
      case 'ADMIN':
        return [{ value: 'UNIT_MANAGER', label: 'Unit Manager' }];
      case 'UNIT_MANAGER':
        return [{ value: 'USER', label: 'User' }];
      default:
        return [];
    }
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Username, email, and password are required');
      return;
    }
    
    // Set role to default if not selected
    const submitData = {
      ...form,
      role: form.role || getDefaultRole()
    };
    
    try {
      setLoading(true);
      setError('');
      await API.post('/api/auth/register', submitData);
      setForm({ username: '', email: '', password: '', role: '', timezone: 'UTC' });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Don't show form if user has no permission to create
  if (user?.role === 'USER') {
    return null;
  }

  const availableRoles = getAvailableRoles();

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        {showForm ? 'Cancel' : '+ Add New User'}
      </button>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create New {availableRoles[0]?.label || 'User'}
          </h3>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
          
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
            
            {/* Role dropdown - only shows allowed roles based on logged-in user */}
            {availableRoles.length > 1 && (
              <select 
                value={form.role} 
                onChange={(e) => setForm({ ...form, role: e.target.value })} 
                className="px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Select Role</option>
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            )}
            
            {/* If only one role available, show disabled field */}
            {availableRoles.length === 1 && (
              <input 
                value={availableRoles[0].label} 
                disabled 
                className="px-4 py-2 border border-gray-300 rounded bg-gray-100"
              />
            )}
            
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
            {loading ? 'Creating...' : `Create ${availableRoles[0]?.label || 'User'}`}
          </button>
        </div>
      )}
    </div>
  );
}