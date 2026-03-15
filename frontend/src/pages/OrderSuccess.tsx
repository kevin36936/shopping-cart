import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h2>
        <p className="text-gray-500 text-sm">
          Thank you for your purchase. Your order has been placed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
