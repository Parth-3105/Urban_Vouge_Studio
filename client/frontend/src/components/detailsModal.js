import React, { useState, useEffect, useContext } from "react";
import { Modal, Button, Row, Col, Badge, Carousel, Form } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const ProductModal = ({ selectedProduct, showModal, setShowModal, addToCart }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", text: "", rating: 5 });
  const navigate=useNavigate();
  useEffect(() => {
    if (selectedProduct) {
      axios.get(`https://clothing-mern-project-server.onrender.com/api/reviews?productId=${selectedProduct._id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedProduct]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = (e) => {
    if (user) {
      e.preventDefault();
      axios.post('https://clothing-mern-project-server.onrender.com/api/reviews', {
        product: selectedProduct._id,
        name: reviewForm.name,
        text: reviewForm.text,
        rating: reviewForm.rating,
      })
        .then((res) => {
          setReviews((prevReviews) => [res.data, ...prevReviews]);
          setReviewForm({ name: '', text: '', rating: 5 });
        })
        .catch((err) => console.error(err));
    }
    else{
        navigate('/auth')
    }
  };

  if (!selectedProduct) return null;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
      <Modal.Header closeButton className="border-0 bg-light">
        <Modal.Title className="fw-bold text-dark">{selectedProduct.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3">
        <Row className="align-items-center">
          <Col md={5} className="text-center mb-3 mb-md-0">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          </Col>

          <Col md={7}>
            <div className="p-2">
              <p><strong className="text-dark">Price:</strong> <span className="text-danger fw-semibold">Rs. {selectedProduct.price}</span></p>
              <p><strong className="text-dark">Category:</strong> <Badge bg="info" text="dark">{selectedProduct.category}</Badge></p>
              <p><strong className="text-dark">Brand:</strong> <span className="text-secondary">{selectedProduct.brand}</span></p>
              <p><strong className="text-dark">Stock:</strong> <span className={selectedProduct.stock ? "text-success fw-bold" : "text-danger fw-bold"}>{selectedProduct.stock ? "In Stock" : "Out of Stock"}</span></p>
              <p><strong className="text-dark">Rating:</strong> <span className="text-warning">{selectedProduct.rating}★</span></p>

              <Button
                variant="primary"
                className="mt-3"
                onClick={() => {
                  addToCart(selectedProduct);
                  setShowModal(false);
                }}
              >
                Add to Cart
              </Button>
            </div>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Review Carousel */}
        {reviews.length > 0 ? (
          <Carousel className="mb-4">
            {reviews.map((review) => (
              <Carousel.Item key={review._id}>
                <div className="text-center">
                  <p className="fs-5 fst-italic">"{review.text}"</p>
                  <h6 className="text-primary">- {review.name}</h6>
                  <div className="text-warning">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <p className="text-center text-muted">No reviews yet.</p>
        )}

        {/* Add Review Form */}
        <Form onSubmit={handleReviewSubmit}>
          <h5 className="mb-3">Add a Review</h5>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="reviewName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="reviewRating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  name="rating"
                  value={reviewForm.rating}
                  onChange={handleReviewChange}
                >
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>{star}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="reviewText">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="text"
              value={reviewForm.text}
              onChange={handleReviewChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Submit Review
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
