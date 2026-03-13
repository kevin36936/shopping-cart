import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    // Show a spinner or a simple loading message
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, message: "Please log in to access checkout" }}
        replace
      />
    );
  }

  return <>{children}</>;
}
