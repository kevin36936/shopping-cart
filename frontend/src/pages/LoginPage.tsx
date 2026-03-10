import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function LoginPage() {
  const { login } = useUser();

  return (
    <div className="mb-8">
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
