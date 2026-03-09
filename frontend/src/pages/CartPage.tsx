import { useCart } from "../contexts/CartContext";
import ShoppingCart from "../components/ShoppingCart"

export default function CartPage() {
    const { cart, removeFromCart, clearCart } = useCart();

    return (
        <ShoppingCart
            cart={cart}
            onRemove={removeFromCart}
            onClear={clearCart}
        />
    )
}