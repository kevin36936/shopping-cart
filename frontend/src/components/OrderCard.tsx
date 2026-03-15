import type { Order } from "../types/order.types";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const statusColor: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900">Order #{order.id}</span>
        <span className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Status + Total */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[order.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {order.status}
        </span>
        <span className="font-bold text-gray-900">${order.totalAmount}</span>
      </div>

      {/* Items */}
      <div className="border-t border-gray-100 pt-3 space-y-1">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600">
            <span className="line-clamp-1 flex-1 mr-4">{item.productName}</span>
            <span className="flex-shrink-0">
              {item.quantity} × ${item.priceAtTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCard;
