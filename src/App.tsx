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
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <ProductList products={products} onAddToCart={addToCart} />
      <ShoppingCart cart={cart} onRemove={removeFromCart} />
    </div>
  );
}

export default App;
