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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">WaveNet</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden md:block text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {user && (
            <span className="text-xs md:text-sm text-gray-600 truncate max-w-[120px] md:max-w-none">
              {user.username}
            </span>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-1.5 px-3 md:py-2 md:px-4 rounded-lg transition-colors text-sm md:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}