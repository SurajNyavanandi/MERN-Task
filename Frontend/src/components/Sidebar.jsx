import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const { user } = useContext(AuthContext);

  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { path: "/dashboard", name: "Dashboard", icon: "📊" },
      { path: "/invoices", name: "Invoices", icon: "📄" }
    ];

    const roleBasedItems = {
      SUPER_ADMIN: [
        { path: "/users", name: "Users", icon: "👥" },
        { path: "/admin-groups", name: "Admin Groups", icon: "👑" }
      ],
      ADMIN: [
        { path: "/users", name: "Users", icon: "👥" },
        { path: "/unit-groups", name: "Unit Groups", icon: "🏢" }
      ],
      UNIT_MANAGER: [
        { path: "/users", name: "Users", icon: "👥" }
      ],
      USER: []  // Users can't manage other users
    };

    return [...commonItems, ...(roleBasedItems[user?.role] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen shadow-lg p-6 flex flex-col gap-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-blue-400">WaveNet</h2>
        <p className="text-xs text-gray-400 mt-1">Role: {user?.role}</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Role Info Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>Logged in as:</p>
          <p className="text-gray-400 font-medium truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;