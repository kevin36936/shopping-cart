import { useEffect, useState } from "react";
// import "./App.css";
import type { Item, CartItem } from "./types";
import ProductList from "./components/ProductList";
import ShoppingCart from "./components/ShoppingCart";

function App() {
  const [products, setProducts] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/product")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("error fetching products:", err);
        setLoading(false);
      });
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Container */}
      <div className="container mx-auto p-8">
        
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Shopping Cart
        </h1>
        
        {/* Main Layout: Products + Cart Side-by-Side */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left: Product List (Takes most space) */}
          <div className="flex-1">
            <ProductList 
              products={products} 
              onAddToCart={addToCart} 
            />
          </div>
          
          {/* Right: Shopping Cart (Fixed width) */}
          <div className="lg:w-96">
            <ShoppingCart 
              cart={cart} 
              onRemove={removeFromCart} 
            />
          </div>
          
        </div>
      </div>
    </div>
  );
  
}

export default App;
