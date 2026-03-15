import { useCart } from "../contexts/CartContext";
import ShoppingCart from "../components/ShoppingCart";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
      <ShoppingCart cart={cart} onRemove={removeFromCart} onClear={clearCart} />
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
