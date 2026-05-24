import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar({ onClose }) {
  const { user } = useContext(AuthContext);

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
      USER: []
    };

    return [...commonItems, ...(roleBasedItems[user?.role] || [])];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-gray-900 text-white h-full shadow-xl p-4 flex flex-col">
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <div className="mb-8 mt-8 lg:mt-0">
        <h2 className="text-2xl font-bold text-blue-400">WaveNet</h2>
        <p className="text-xs text-gray-400 mt-1">Role: {user?.role}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>Logged in as:</p>
          <p className="text-gray-400 font-medium truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;