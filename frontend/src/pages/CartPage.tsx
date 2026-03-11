import { useCart } from "../contexts/CartContext";
import ShoppingCart from "../components/ShoppingCart";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div>
      <ShoppingCart cart={cart} onRemove={removeFromCart} onClear={clearCart} />

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate("/checkout")}
          disabled={cart.length === 0}
          className={`bg-green-600 text-white px-6 py-2 rounded ${
            cart.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
