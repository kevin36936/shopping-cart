import { useState } from "react";
import axios from "axios";
import type { User } from "../types/user.types";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onLoginSuccess: (token: string, user: User) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      const { token, user } = res.data;
      onLoginSuccess(token, user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
      <p className="text-sm text-gray-500 -mt-2">Sign in to your account</p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          placeholder="••••••"
          value={formData.password}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Test: Laurie_Wuckert@yahoo.com / password123
      </p>
    </form>
  );
};

export default LoginForm;
