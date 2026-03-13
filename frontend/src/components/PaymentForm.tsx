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
      // create paymentIntent
      const res = await axios.post(
        `${API_URL}/api/create-payment-intent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-Type": "application/json",
          },
        },
      );

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(res.data.clientSecret, {
          payment_method: {
            card: cardElement!,
          },
        });

      if (confirmError) {
        throw confirmError;
      }

      if (paymentIntent.status === "succeeded") {
        await clearCart();
        navigate("/order-success");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        if (err.response) {
          // Server responded with a status code
          const status = err.response.status;
          if (status >= 500) {
            setErrorMessage("Server error. Please try again later.");
          } else if (status === 401) {
            setErrorMessage("Your session has expired. Please log in again.");
          } else if (status === 400) {
            setErrorMessage(err.response.data?.error || "Invalid request.");
          } else {
            setErrorMessage("Payment failed. Please try again.");
          }
        } else if (err.request) {
          // Request was made but no response received (network error)
          setErrorMessage("Network error. Please check your connection.");
        } else {
          // Something else happened while setting up the request
          setErrorMessage("An unexpected error occurred.");
        }
      } else if (err instanceof Error) {
        // Handle non-Axios errors (like Stripe errors or generic ones)
        setErrorMessage(err.message);
      } else {
        console.error("Unexpected error:", err);
        setErrorMessage("Something went wrong.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Complete your payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CardElement container */}
        <div className="p-4 border rounded-md bg-gray-50">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>
        {/* Error message */}
        {errorMessage && (
          <div className="text-red-600 text-sm">{errorMessage}</div>
        )}
        {/* Pay button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay $${formattedTotal}`}
        </button>
      </form>
      <Link
        to="/cart"
        className="text-blue-600 hover:underline block mt-4 text-center"
      >
        ← Return to cart
      </Link>
    </div>
  );
}
