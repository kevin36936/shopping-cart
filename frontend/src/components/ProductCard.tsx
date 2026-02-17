import type { Item, ProductCardProps } from "../types"

export default function ProductCard({ id, title, price, image, onAddToCart }: ProductCardProps) {

    const handleAddToCart = () => {
        const product: Item = {
            id,
            title,
            price,
            image
        }
        onAddToCart(product);
    }
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            {/* Image Section */}
            <div className="relative">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-contain bg-gray-50 p-4"
                />
            </div>

            {/* Info Section */}
            <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[40px]">
                    {title}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-gray-900">
                    ${price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    )
}