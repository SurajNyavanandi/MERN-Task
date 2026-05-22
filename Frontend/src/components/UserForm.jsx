import { useState } from 'react';

function UserForm({ fetchUsers }) {
  const [showForm, setShowForm] = useState(false);

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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create New User
          </h3>
          <p className="text-gray-600 text-sm">
            User form - implement based on backend requirements
          </p>
        </div>
      )}
    </div>
  );
}

export default UserForm;