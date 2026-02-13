import type {Item, ProductCardProps} from "../types"

export default function ProductCard({id, title, price, image, onAddToCart}: ProductCardProps){
    
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
        <div>
            <img src={image} alt={title}></img>
            <span>Product name: {title} <br/></span>
            <span>Price: ${price.toFixed(2)} <br/></span>
            <button onClick={handleAddToCart}>
                add to Cart
            </button>
        </div>
    )
}