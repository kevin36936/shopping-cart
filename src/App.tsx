import { useEffect, useState } from "react";
import "./App.css";

interface Item {
  id: number;
  title: string;
  price: number;
  image: string
}

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  onRemove: (id: number) => void;
}

function CartItem({id, name, price, onRemove}: CartItemProps) {
  return (
    <div>
      <span>id: {id}</span>
      <span>{name} </span>
      <span>${price}</span> 
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
}

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

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
      <div>
        Items:{" "}
        {items.map((item) => (
          <CartItem 
          key={item.id}
          id={item.id}
           name={item.title}
            price={item.price}
            onRemove={removeItem} />
        ))}
      </div>
    </>
  );
}

export default App;
