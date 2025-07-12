import React from "react";
import { useCart } from "../context/cartContext";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Card,
  Image,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    const user = localStorage.getItem('user');
    if(user){
      navigate("/checkout");
    }
    else{
      navigate("/auth")
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4 fw-bold">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <Alert variant="warning" className="text-center">
          Your cart is currently empty. Go explore some amazing products!
        </Alert>
      ) : (
        <>
          <Row className="gy-4">
            <Col lg={8}>
              {cart.map((item) => (
                <Card key={item._id} className="mb-3 shadow-sm border-1">
                  <Card.Body className="d-flex align-items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width="90"
                      height="90"
                      rounded
                      className="me-3 object-fit-cover border"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{item.name}</h6>
                      <p className="mb-1 text-muted">₹ {item.price.toFixed(2)}</p>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => decreaseQuantity(item._id)}
                          disabled={item.quantity === 1}
                        >
                          −
                        </Button>
                        <span className="mx-2">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => increaseQuantity(item._id)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="ms-3"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ❌
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card className="shadow border-1">
                <Card.Body>
                  <h5 className="fw-bold mb-3 text-center">🧾 Order Summary</h5>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Items:</span>
                    <span>{cart.length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Total Amount:</span>
                    <span className="fw-bold text-success">₹ {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="d-grid gap-2">
                    <Button variant="danger" onClick={clearCart}>
                      🗑️ Clear Cart
                    </Button>
                    <Button variant="success" onClick={handleCheckout}>
                      ✅ Proceed to Checkout
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default CartPage;
