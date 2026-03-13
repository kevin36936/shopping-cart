// pages/OrderSuccess.tsx
export default function OrderSuccess() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful! 🎉</h2>
      <p className="mb-4">Thank you for your purchase. Your order has been placed.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Continue Shopping
      </button>
    </div>
  );
}