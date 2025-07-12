import React, { useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { FaCreditCard } from "react-icons/fa";

const stripePromise = loadStripe("pk_test_51R9mybBLys643ZzWJHgd6JeBk1tK486BSV3kyR8qxYuAPqeBfWz6LaBSGNRoLJ4bfEjguxckA7kLKIKRpbrp2qjc00bpfgdJiK");

const CheckoutForm = ({ totalAmount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("https://clothing-mern-project-server.onrender.com/api/payment/create-payment-intent", {
        amount: Math.round(totalAmount * 100),
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (!result.error) {
        onPaymentSuccess("Completed");
      } else {
        console.error("Payment error:", result.error.message);
      }
    } catch (error) {
      console.error("Axios error:", error.response ? error.response.data : error.message);
    }

    setLoading(false);
  };

  return (
    <Card className="p-4 border-1 shadow-sm rounded-4 mt-3">
      <div className="text-center mb-3">
        <FaCreditCard size={26} className="text-primary" />
        <h5 className="fw-bold mt-2">Enter Payment Details</h5>
      </div>

      <form onSubmit={handlePayment}>
        <div className="mb-3 p-3 bg-white border rounded shadow-sm">
          <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
        </div>

        <Button
          variant="success"
          type="submit"
          disabled={loading}
          className="w-100 py-2 fw-semibold rounded-3"
        >
          {loading ? <Spinner animation="border" size="sm" /> : `Pay ₹${totalAmount}`}
        </Button>
      </form>
    </Card>
  );
};

export default function PaymentForm(props) {
  return <Elements stripe={stripePromise}><CheckoutForm {...props} /></Elements>;
}
