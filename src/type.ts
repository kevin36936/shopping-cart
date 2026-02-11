export interface Item {
    id: number;
    title: string;
    price: number;
    image: string;
}

export interface CartItem {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

export interface ProductListProps {
    products: Item[];
    onAddToCart: (product: Item) => void;
}

export interface ShoppingCartProps {
    cart: CartItem[];
    
}

export interface ProductCardProps {

}

export interface CartItemProps {

}