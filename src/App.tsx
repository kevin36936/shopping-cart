import { useEffect, useState } from "react";
import "./App.css";
import type { Item, CartItem } from "./type";

function App() {
  const [products, setProducts] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const total_in_cent = products.reduce(
    (sum, item) => sum + item.price * 100,
    0,
  );
  const total_in_dollar = (total_in_cent / 100).toFixed(2);
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
          (item.id === product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
        return updatedCart;
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter((item) => item.id !== id));
  };


  return (
    <>
      <h1>My Shopping Cart</h1>
      <p>Items in Cart: {products.length}</p>
      <p>Total price: ${total_in_dollar}</p>
      <div>
        Items:{" "}
        {products.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.title}
            price={item.price}
            image={item.image}
            onRemove={removeItem}
          />
        ))}
      </div>
    </>
  );
}

export default App;
