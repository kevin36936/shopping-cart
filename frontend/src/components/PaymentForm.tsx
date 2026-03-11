import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";

export default function PaymentForm() {
  const { token } = useUser();
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
            Authorization: `Bearer ${token},
        "content-Type: "application/json`,
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
        setErrorMessage("Something went wrong.");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card-element-wrapper">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
            },
          }}
        />
      </div>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing…" : "Pay now"}
      </button>
    </form>
  );
}
