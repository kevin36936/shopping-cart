import type { CartItemProps } from "../types";

function CartItem({
  id,
  title,
  price,
  image,
  quantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded-md border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          ${price.toFixed(2)} × {quantity}
        </p>
        <p className="text-base font-bold text-green-600 mt-1">
          Subtotal: ${(price * quantity).toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
