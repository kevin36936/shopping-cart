import type { ProductListProps } from "../types";
import ProductCard from "./ProductCard"

export default function ProductList({products, onAddToCart}: ProductListProps) {
    return (
        <div>
            {products.map(product => (
                <ProductCard
                key={product.id}
                {...product}
                onAddToCart={onAddToCart}/>
            ))}
        </div>
    )
}