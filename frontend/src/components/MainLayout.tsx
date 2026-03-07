import { useUser } from "../contexts/UserContext";
import { useProducts } from "../contexts/ProductsContext";
import { useCart } from "../contexts/CartContext";
import ProductList from "./ProductList";
import ShoppingCart from "./ShoppingCart";
import LoginForm from "./LoginForm";

export default function MainLayout() {
  const { user, logout, login } = useUser();
  const { products, loading, error } = useProducts();
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  if (loading) return <div>Loading products ...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Product List */}
          <div className="flex-1">
            <ProductList
              products={products}
              onAddToCart={(product) => addToCart(product)}
            />
          </div>

          {/* Right: Login & Cart */}
          <div className="lg:w-96">
            {/* Conditional login / user info */}
            <div className="mb-8">
              {user ? (
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-700">Logged in as: {user.email}</p>
                  <button
                    onClick={logout}
                    className="mt-2 bg-red-500 text-white rounded p-2 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <LoginForm onLoginSuccess={login} />
              )}
            </div>

            {/* Shopping Cart */}
            <ShoppingCart
              cart={cart}
              onRemove={removeFromCart}
              onClear={clearCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
