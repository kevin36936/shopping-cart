import { useState } from "react"
import axios from "axios"
import type { LoginFormData, UserProfile } from "../types"

const LoginForm = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const fetchProfile = async (token: string) => {
        const res = await axios.get(`${API_URL}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/login`, formData);
            const token = response.data.token;
            localStorage.setItem('token', token);
            await fetchProfile(token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (profile) {
        return (
            <div className="max-w-md mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Welcome! 👋</h2>
                <p className="text-gray-600">Email: {profile.email}</p>
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        setProfile(null);
                    }}
                    className="mt-4 bg-red-500 text-white rounded p-2 hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        );
    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold">Login</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded p-2"
                required
            />

            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="border rounded p-2"
                required
            />

            <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {/* Quick test hint */}
            <p className="text-xs text-gray-400">
                Test: Laurie_Wuckert@yahoo.com  / password123
            </p>
        </form>
    );
}

export default LoginForm;