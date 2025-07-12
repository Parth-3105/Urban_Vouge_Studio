import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  ListGroup,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaBoxOpen } from "react-icons/fa";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`https://clothing-mern-project-server.onrender.com/api/order/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <h2 className="text-center mb-4 fw-bold text-primary">
        <FaBoxOpen className="me-2" /> My Orders
      </h2>

      {orders.length === 0 ? (
        <h5 className="text-muted text-center">No orders found.</h5>
      ) : (
        orders.map((order, idx) => (
          <Card key={idx} className="mb-4 border-2 shadow-sm rounded-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center rounded-top">
              <span className="fw-bold">Order #{idx + 1}</span>
              <Badge
                bg={order.paymentStatus === "Completed" ? "success" : "warning"}
                className="px-3 py-2"
              >
                {order.paymentStatus === "Completed" ? (
                  <>
                    <FaCheckCircle className="me-1" />
                    Paid
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="me-1" />
                    Pending
                  </>
                )}
              </Badge>
            </Card.Header>

            <Card.Body className="px-4 py-3">
              <Row className="mb-3">
                <Col md={6}>
                  <h6 className="text-secondary">Total Amount</h6>
                  <p className="fw-bold text-dark fs-5">₹{order.totalAmount}</p>
                </Col>
                <Col md={6}>
                  <h6 className="text-secondary">Shipping Address</h6>
                  <p className="mb-0 text-muted">
                    {order.address?.street}, {order.address?.city},<br />
                    {order.address?.state} - {order.address?.zip}, {order.address?.country}
                  </p>
                </Col>
              </Row>

              <h6 className="text-secondary">Ordered Products</h6>
              <ListGroup variant="flush">
                {order.products.map((item, i) => (
                  <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center py-3">
                    <div>
                      <span className="fw-semibold">{item.name}</span>
                      <div className="text-muted small">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>
                    <span className="fw-bold text-dark">
                      ₹{item.price * item.quantity}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default UserOrders;
