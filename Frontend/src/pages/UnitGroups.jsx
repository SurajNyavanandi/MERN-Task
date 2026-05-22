import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';

export default function UnitGroups() {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await API.get('/api/unit-groups');
      setGroups(data.groups || []);
    } catch (error) {
      console.error('Error fetching unit groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Only ADMIN and SUPER_ADMIN can access this page</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Groups Management</h1>
        <p className="text-gray-600 mb-6">Create and manage unit groups for visibility sharing between UNIT_MANAGERS</p>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4">
              + Create Unit Group
            </button>
            
            {groups.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No unit groups created yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Group Name</th>
                      <th className="px-4 py-2 text-left">Unit Managers</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => (
                      <tr key={group._id} className="border-b">
                        <td className="px-4 py-2">{group.name}</td>
                        <td className="px-4 py-2">{group.unitManagers?.length || 0} managers</td>
                        <td className="px-4 py-2">{new Date(group.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}