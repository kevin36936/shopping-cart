import type { Order } from "../types/order.types";
interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Order #{order.id}</span>
        <span className="text-sm text-gray-600">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span>
          Status: <span className="capitalize">{order.status}</span>
        </span>
        <span className="font-bold">Total: ${order.totalAmount}</span>
      </div>
      <div className="mt-2">
        <h3 className="font-medium mb-1">Items:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {order.items.map((item, idx) => (
            <li key={idx}>
              Product {item.productName} – {item.quantity} × ${item.priceAtTime}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderCard;
