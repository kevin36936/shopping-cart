import { useEffect, useState, useRef } from "react";
// import "./App.css";
import ProductList from "./components/ProductList";
import ShoppingCart from "./components/ShoppingCart";
import LoginForm from "./components/LoginForm";
import axios from "axios";
import {useProducts} from "./hooks/useProducts"
import {useCart} from "./hooks/useCart"

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const logoutRef = useRef<() => void>(() => {});

  const {products, loading, error} = useProducts(API_URL);
  const {cart, setCart, mergeGuestCart, addToCart, removeFromCart, clearCart} = useCart(API_URL, 
    () => logoutRef.current());

  //Authentication state
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  // --- Check for existing token on app start ---
  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem("token");
    const verifyToken = async (token: string) => {
      try {
        const res = await axios.get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) {
          const { id, email } = res.data;
          handleAuthenticated(token, { id, email });
        }
      } catch {
        localStorage.removeItem("token");
      }
    };

    if (storedToken) verifyToken(storedToken);

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  const handleAuthenticated = (
    newToken: string,
    userData: { id: number; email: string },
  ) => {
    setToken(newToken);
    setUser(userData);
    mergeGuestCart(newToken, cart);
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Product List */}
          <div className="flex-1">
            <ProductList products={products} onAddToCart={(product) => addToCart(product, token)} />
          </div>

          {/* Right: Login & Cart */}
          <div className="lg:w-96">
            {/* Conditional login / user info */}
            <div className="mb-8">
              {user ? (
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-gray-700">Logged in as: {user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-500 text-white rounded p-2 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <LoginForm onLoginSuccess={handleAuthenticated} />
              )}
            </div>

            {/* Shopping Cart */}
            <ShoppingCart
              cart={cart}
              onRemove={(id) => removeFromCart(id, token)}
              onClear={() => clearCart(token)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
