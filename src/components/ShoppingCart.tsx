import type { ShoppingCartProps } from "../types"
import CartItem from "./CartItem"

export default function ShoppingCart({ cart, onRemove }: ShoppingCartProps) {
    const totalInCent = cart.reduce(
        (sum, item) => sum + item.price * item.quantity * 100,
        0,
    );
    const totalInDollar = (totalInCent / 100).toFixed(2);
    return (
        <div>
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : <>
                {cart.map((item) => <CartItem
                    key={item.id}
                    {...item}
                    onRemove={onRemove} />
                )
                }
            </>}
            <div>
                Amount: ${totalInDollar}
            </div>
        </div>
    )
}


