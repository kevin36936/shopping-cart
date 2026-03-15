import LoginForm from "../components/LoginForm";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function LoginPage() {
  const { login } = useUser();
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 w-full max-w-md space-y-4">
        {message && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-4 py-3 rounded-xl">
            {message}
          </div>
        )}
        <LoginForm onLoginSuccess={login} />
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
