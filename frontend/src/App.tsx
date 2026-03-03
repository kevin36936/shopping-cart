import { useEffect, useState } from "react";
// import "./App.css";
import type { Item, CartItem } from "./types";
import ProductList from "./components/ProductList";
import ShoppingCart from "./components/ShoppingCart";
import LoginForm from "./components/LoginForm";
import axios from "axios";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  // Products state
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  //Authentication state
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);

  // load products on mount
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        if (isMounted) setProducts(res.data);
      } catch (err) {
        if (isMounted) setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // --- Fetch server cart (for authenticated users) ---
  const fetchServerCart = async (authToken: string) => {
    try {
      const res = await axios.get(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCart(res.data.items);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  // --- Merge guest cart with server cart after login ---
  const mergeGuestCart = async (authToken: string, guestCart: CartItem[]) => {
    if (guestCart.length === 0) {
      await fetchServerCart(authToken);
      return;
    }

    try {
      const serverRes = await axios.get(`${API_URL}/cart/items`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const serverItems: CartItem[] = serverRes.data.items;

      // 2. Build a map of server items for quick lookup
      const serverMap = new Map(serverItems.map((item) => [item.id, item]));

      // 3. For each guest item, decide action
      const promises = guestCart.map(async (guestItem) => {
        const serverItem = serverMap.get(guestItem.id);
        if (serverItem) {
          const newQty = serverItem.quantity + guestItem.quantity;
          return axios.patch(
            `${API_URL}/cart/items/${guestItem.id}`,
            { newQuantity: newQty },
            { headers: { Authorization: `Bearer ${authToken}` } },
          );
        } else {
          return axios.post(
            `${API_URL}/cart/items`,
            { productId: guestItem.id, quantity: guestItem.quantity },
            { headers: { Authorization: `Bearer ${authToken}` } },
          );
        }
      });

      await Promise.all(promises);

      // 4. Fetch the final server cart and update state
      await fetchServerCart(authToken);
    } catch (err) {
      console.error("Merge failed", err);
    }
  };

  const handleAuthenticated = (
    newToken: string,
    userData: { id: number; email: string },
  ) => {
    setToken(newToken);
    setUser(userData);
    mergeGuestCart(newToken, cart);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const addToCart = async (product: Item) => {
    // guest
    if (!token) {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else return [...prev, { ...product, quantity: 1 }];
      });
    } else {
      // Authenticated
      try {
        await axios.post(
          `${API_URL}/cart/items`,
          { productId: product.id, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        await fetchServerCart(token);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          handleLogout();
        } else {
          console.error("Add to cart failed", err);
        }
      }
    }
  };

  const removeFromCart = async (id: number) => {
    // guest
    if (!token) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      // Authenticated
      try {
        await axios.delete(`${API_URL}/cart/items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchServerCart(token);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          handleLogout();
        } else {
          console.error("Deleted from cart failed");
        }
      }
    }
  };

  const clearCart = async () => {
    if (!token) {
      setCart([]);
    } else {
      try {
        await axios.delete(`${API_URL}/cart/items`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await fetchServerCart(token);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          handleLogout();
        } else {
          console.error("Deleted from cart failed");
        }
      }
    }
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
            <ProductList products={products} onAddToCart={addToCart} />
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
              onRemove={removeFromCart}
              onClear={clearCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
