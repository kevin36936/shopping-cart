import { Outlet, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function MainLayout() {
  const { user, logout } = useUser();
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">🛍 Shopping Cart</h1>

        <div className="flex items-center gap-4">
          {user ? <div>
            {user.email}
            <button onClick={logout}>
              Logout
            </button>
          </div> :
            <Link to="/login">
              cart
            </Link>
          }
          <Link to="/cart">
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
              {totalItems}
            </span>
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
