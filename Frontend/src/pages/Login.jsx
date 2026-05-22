import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    console.log("Attempting login with:", { email, password });
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });
    console.log("Login response:", res.data);
    login(res.data);
    navigate("/dashboard");
  } catch (err) {
    console.log("Full error object:", err);
    console.log("Error response:", err.response);
    console.log("Error message:", err.response?.data?.message);
    alert("Invalid credentials");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
        >
          Login
        </button>

        <p
          onClick={() => navigate("/register")}
          className="text-center mt-4 text-blue-500 cursor-pointer hover:underline"
        >
          Create account
        </p>
      </div>
    </div>
  );
}