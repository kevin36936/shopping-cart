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
    onRemove: (id: number) => void;
}

export interface ProductCardProps {
    id: number;
    title: string;
    price: number;
    image: string;
    onAddToCart: (product: Item) => void;
}

export interface CartItemProps {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number
    onRemove: (id: number) => void;
}