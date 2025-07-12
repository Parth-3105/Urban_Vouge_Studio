import React, { useState } from "react";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import axios from "axios";
import AddressForm from "./addressForm";
import PaymentForm from "./paymentForm";
import { useCart } from "../context/cartContext";
import { FaCheckCircle, FaCreditCard, FaMapMarkedAlt } from "react-icons/fa";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const [address, setAddress] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrderSubmit = async (paymentStatus) => {
    const orderData = {
      user: JSON.parse(localStorage.getItem("user"))._id,
      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      address,
      paymentStatus,
    };

    try {
      const response = await axios.post("https://clothing-mern-project-server.onrender.com/api/order/add", orderData);
      if (response.status === 201) {
        setOrderPlaced(true);
        clearCart();
      } else {
        console.error("Failed to place order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow p-4 rounded-4 border-0">
        <h2 className="text-center text-primary mb-4 fw-bold">🛒 Checkout</h2>

        {/* Progress Indicator */}
        <Row className="justify-content-center mb-4">
          <Col xs={6} md={3} className="text-center">
            <FaMapMarkedAlt size={30} className={address ? "text-success" : "text-secondary"} />
            <p className="mb-0 fw-semibold">Address</p>
          </Col>
          <Col xs={6} md={3} className="text-center">
            <FaCreditCard size={30} className={address ? "text-primary" : "text-secondary"} />
            <p className="mb-0 fw-semibold">Payment</p>
          </Col>
        </Row>

        {/* Success Message */}
        {orderPlaced && (
          <Alert variant="success" className="text-center fw-bold">
            <FaCheckCircle className="me-2" />
            🎉 Order Placed Successfully!
          </Alert>
        )}

        {!orderPlaced && (
          <Row>
            {/* Left Column: Address Form */}
            <Col md={6}>
              <AddressForm setAddress={setAddress} />
            </Col>

            {/* Right Column: Payment Form */}
            {address && (
              <Col md={6}>
                <Card className="p-4 border-0 shadow-sm rounded-3 mt-4 mt-md-0">
                  <h5 className="text-center mb-3 text-secondary">
                    Total to Pay: <span className="text-dark fw-bold">₹{totalAmount}</span>
                  </h5>
                  <PaymentForm totalAmount={totalAmount} onPaymentSuccess={handleOrderSubmit} />
                </Card>
              </Col>
            )}
          </Row>
        )}
      </Card>
    </Container>
  );
};

export default Checkout;
