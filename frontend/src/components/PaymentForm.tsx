import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function PaymentForm() {
  const { token } = useUser();
  const { cart, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const totalAmount = cart?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const formattedTotal = totalAmount.toFixed(2);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage("Payment system is not ready. Please try again.");
      return;
    }
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${API_URL}/api/payments/create-payment-intent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-Type": "application/json",
          },
        },
      );

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(res.data.clientSecret, {
          payment_method: { card: cardElement },
        });

      if (confirmError) throw confirmError;

      if (paymentIntent.status === "succeeded") {
        const orderRes = await axios.post(
          `${API_URL}/api/orders`,
          { paymentIntentId: paymentIntent.id },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        console.log(`Order created:`, orderRes.data.orderId);
        await clearCart();
        navigate("/order-success");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status && status >= 500)
          setErrorMessage("Server error. Please try again later.");
        else if (status === 401)
          setErrorMessage("Your session has expired. Please log in again.");
        else if (status === 400)
          setErrorMessage(err.response?.data?.error || "Invalid request.");
        else if (err.request)
          setErrorMessage("Network error. Please check your connection.");
        else setErrorMessage("Payment failed. Please try again.");
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Complete your payment
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4"
      >
        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
          <CardElement
            options={{
              style: { base: { fontSize: "16px", color: "#1f2937" } },
            }}
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {isProcessing ? "Processing..." : `Pay $${formattedTotal}`}
        </button>
      </form>

      <Link
        to="/cart"
        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        ← Return to cart
      </Link>
    </div>
  );
}
