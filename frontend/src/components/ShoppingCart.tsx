import type { ShoppingCartProps } from "../types"
import CartItem from "./CartItem"
export default function ShoppingCart({ cart, onRemove }: ShoppingCartProps) {
    const totalInCent = cart.reduce(
        (sum, item) => sum + item.price * item.quantity * 100,
        0,
    );
    const totalInDollar = (totalInCent / 100).toFixed(2);

    return (
        <div className="bg-gray-50 border-l-4 border-blue-600 p-6 m-2">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-300">
                Shopping Cart
            </h2>

            {/* Cart Items or Empty State */}
            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 italic">
                    Your cart is empty
                </p>
            ) : (
                <>
                    <div className="space-y-0 bg-white rounded-md">
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                {...item}
                                onRemove={onRemove}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Total Section */}
            <div className="mt-6 pt-4 border-t-2 border-gray-400">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                        Total Amount:
                    </span>
                    <span className="text-3xl font-bold text-blue-600">
                        ${totalInDollar}
                    </span>
                </div>
            </div>
        </div>
    )
}
