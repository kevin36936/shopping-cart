import { useEffect, useState } from "react";
// import "./App.css";
import type { Item, CartItem } from "./types";
import ProductList from "./components/ProductList";
import ShoppingCart from "./components/ShoppingCart";
import LoginForm from "./components/LoginForm";

function App() {
  const [products, setProducts] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchProduct() {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.log("fetchProduct error:", err);
      throw err;
    }
  }

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const products = await fetchProduct();
        if (!isMounted) return; //avoid setState after unmount
        setProducts(products);
      } catch (err) {
        if (!isMounted) return;
        setError("Failed to load products");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const addToCart = (product: Item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(({ id }) => id === product.id);
      if (!existingItem) {
        const newCartItem: CartItem = {
          ...product,
          quantity: 1,
        };
        return [...prevCart, newCartItem];
      } else {
        const updatedCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
        return updatedCart;
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Page Container */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="container mx-auto p-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

        {/* Main Layout: Products + Cart Side-by-Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Product List (Takes most space) */}
          <div className="flex-1">
            <ProductList products={products} onAddToCart={addToCart} />
          </div>

          {/* Right: Shopping Cart (Fixed width) */}
          <div className="lg:w-96">
            <div className="mb-8">
              <LoginForm />
            </div>
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
