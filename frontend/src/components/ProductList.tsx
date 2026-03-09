import type { Item } from "../types/item.types";
import ProductCard from "./ProductCard"

interface ProductListProps {
    products: Item[];
    onAddToCart: (product: Item) => void;
}

export default function ProductList({products, onAddToCart}: ProductListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
                <ProductCard
                key={product.id}
                {...product}
                onAddToCart={onAddToCart}/>
            ))}
        </div>
    )
}