import type { Item } from "../types/item.types";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Item[];
  onAddToCart: (product: Item) => void;
}

export default function ProductList({
  products,
  onAddToCart,
}: ProductListProps) {
  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-10 mb-10 text-white">
        <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-2">
          Welcome to ShopCart
        </p>
        <h1 className="text-4xl font-bold mb-2">Discover Our Collection</h1>
        <p className="text-gray-300 text-sm">
          {products.length} curated products just for you
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
