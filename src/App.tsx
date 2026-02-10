import { useEffect, useState } from "react";
import "./App.css";
import CartItem from "./components/CartItem"
interface Item {
  id: number;
  title: string;
  price: number;
  image: string
}
function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

  const total_in_cent = items.reduce((sum, item) => sum + item.price * 100, 0)
  const total_in_dollar = (total_in_cent / 100).toFixed(2)
  useEffect(() => {
    setLoading(true);
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      setItems(data);
      setLoading(false)
    })
  }, [])

  if(loading) {
    return <div>Loading...</div>
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }
  return (
    <>
      <h1>My Shopping Cart</h1>
      <p>Items in Cart: {items.length}</p>
      <p>Total price: ${total_in_dollar}</p>
      <div>
        Items:{" "}
        {items.map((item) => (
          <CartItem 
          key={item.id}
          id={item.id}
           name={item.title}
            price={item.price}
            image={item.image}
            onRemove={removeItem} />
        ))}
      </div>
    </>
  );
}

export default App;
