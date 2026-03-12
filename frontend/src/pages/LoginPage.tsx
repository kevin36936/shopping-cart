import LoginForm from "../components/LoginForm";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function LoginPage() {
  const { login } = useUser();
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="mb-8">
      {message && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          {message}
        </div>
      )}
      <LoginForm onLoginSuccess={login} />
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
