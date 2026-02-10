interface CartItemProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onRemove: (id: number) => void;
}

function CartItem({ id, name, price, image, onRemove }: CartItemProps) {
  return (
    <div>
      <img src={image}></img>
      <span>id: {id}</span>
      <span>{name} </span>
      <span>${price}</span>
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
}

export default CartItem;
