import { Outlet, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, User } from "lucide-react";

export default function MainLayout() {
  const { user, logout } = useUser();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const handleLogout = () => {
    if (window.confirm("Are you sure you want logout?")) logout();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar — dark */}
      <header className="sticky top-0 z-50 bg-gray-900 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition-colors"
          >
            🛍 ShopCart
          </Link>

          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link
                  to="/account/profile"
                  className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{user.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
