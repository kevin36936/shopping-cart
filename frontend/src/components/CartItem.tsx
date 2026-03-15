export interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  onRemove: (id: number) => void;
}

export default function CartItem({
  id,
  title,
  price,
  image,
  quantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <img src={image} alt={title} className="w-16 h-16 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">
          ${price.toFixed(2)} × {quantity}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-base font-bold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(id)}
          className="text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
