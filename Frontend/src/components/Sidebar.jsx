import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen shadow-lg p-6 flex flex-col gap-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-blue-400">WaveNet</h2>
      </div>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Dashboard
        </Link>

        <Link
          to="/invoices"
          className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Invoices
        </Link>

        <Link
          to="/users"
          className="block px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Users
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;