import { useProducts } from "../contexts/ProductsContext"
import { useCart } from "../contexts/CartContext"
import ProductList from "../components/ProductList"

export default function HomePage() {
    const { products } = useProducts();
    const { addToCart } = useCart();

    return (
        <ProductList
            products={products}
            onAddToCart={addToCart} 
        />
    )

}