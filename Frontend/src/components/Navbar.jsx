import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-400"></h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-300 hover:text-white transition-colors font-medium"
          >
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-300">
              {user.username}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}