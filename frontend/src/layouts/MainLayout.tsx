import { Outlet, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function MainLayout() {
  const { user, logout } = useUser();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handleLogout = () => {
    if (window.confirm("Are you sure you want logout?")) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold">🛍 Shopping Cart</h1>
        </Link>
        <Link to="/account/profile" className="...">
          My Account
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hello, {user.email}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}

          <Link to="/cart" className="relative inline-flex items-center">
            <span className="text-gray-700">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
