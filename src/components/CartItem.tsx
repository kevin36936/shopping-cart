import type { CartItemProps } from "../types";

function CartItem({ id, title, price, image, quantity, onRemove }: CartItemProps) {
  return (
    <div>
      <img src={image} alt={title} />
      <div>{title}</div>
      <div>
        Price: ${price.toFixed(2)} × {quantity} = ${(price * quantity).toFixed(2)}
      </div>
      <button onClick={() => onRemove(id)}>Remove</button>
    </div>
  );
}

export default CartItem;
