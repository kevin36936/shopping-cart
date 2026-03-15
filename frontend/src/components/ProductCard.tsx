import type { Item } from "../types/item.types";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image: string;
  onAddToCart: (product: Item) => void;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart({ id, title, price, image });
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 h-56 flex items-center justify-center">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-3 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-700 line-clamp-2 min-h-[40px] leading-relaxed">
          {title}
        </h3>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">
          ${price.toFixed(2)}
        </p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-gray-900 hover:bg-blue-600 active:scale-95 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
