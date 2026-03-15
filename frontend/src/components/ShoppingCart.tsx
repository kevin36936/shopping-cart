import type { CartItem as CartItemType } from "../types/cart.types";
import CartItem from "./CartItem";

interface ShoppingCartProps {
  cart: CartItemType[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function ShoppingCart({
  cart,
  onRemove,
  onClear,
}: ShoppingCartProps) {
  const total = (
    cart.reduce((sum, item) => sum + item.price * item.quantity * 100, 0) / 100
  ).toFixed(2);

  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all items from your cart?",
      )
    ) {
      onClear();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
        {cart.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <CartItem key={item.id} {...item} onRemove={onRemove} />
          ))}
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-gray-600 font-medium">Total</span>
        <span className="text-2xl font-bold text-gray-900">${total}</span>
      </div>
    </div>
  );
}
