import { useState } from "react";
import axios from "axios";
import type { LoginFormData } from "../types";
import type { User } from "../types/user.types";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/api/login`, formData);
      const { token, user } = res.data;
      onLoginSuccess(token, user);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold">Login</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => handleChange(e)}
        className="border rounded p-2"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="password"
        value={formData.password}
        onChange={(e) => handleChange(e)}
        className="border rounded p-2"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <p className="text-xs text-gray-400">
        Test: Laurie_Wuckert@yahoo.com / password123
      </p>
    </form>
  );
};

export default LoginForm;
