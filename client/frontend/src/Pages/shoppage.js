import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Spinner,
  Alert,
  Offcanvas,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../context/cartContext";
import ProductModal from "../components/detailsModal";

const ShopPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://clothing-mern-project-server.onrender.com/api/products");
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
    )
    .filter((product) =>
      selectedBrand ? product.brand === selectedBrand : true
    )
    .sort((a, b) =>
      sortOrder === "price-asc" ? a.price - b.price : b.price - a.price
    );

  const handleResetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSortOrder("price-asc");
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const renderFilterPanel = (
    <Form>
      <h5 className="mb-3 fw-semibold">Filters</h5>

      <Form.Group className="mb-2">
        <Form.Label className="small">Category</Form.Label>
        <Form.Select
          size="sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Accessories">Accessories</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="small">Brand</Form.Label>
        <Form.Select
          size="sm"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          <option value="">All</option>
          <option value="Nike">Nike</option>
          <option value="Levi's">Levi's</option>
          <option value="Casio">Casio</option>
          <option value="Adidas">Adidas</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label className="small">Sort By</Form.Label>
        <Form.Select
          size="sm"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </Form.Select>
      </Form.Group>

      <Button
        variant="outline-danger"
        size="sm"
        className="w-100 mt-3"
        onClick={handleResetFilters}
      >
        Reset Filters
      </Button>
    </Form>
  );

  return (
    <Container fluid className="py-4">
      {/* Toggle button for smaller screens */}
      <Button
        variant="primary"
        className="d-md-none mb-3"
        onClick={() => setShowFilters(true)}
      >
        🔍 Filters
      </Button>

      <Row>
        {/* Sidebar on large screens */}
        <Col
          md={3}
          className="d-none d-md-block bg-light p-3 rounded shadow-sm"
          style={{ maxWidth: '220px' }}
        >
          {renderFilterPanel}
        </Col>

        <Col md={9}>
          <h2 className="text-center mb-4 fw-bold">🛍️ Shop Products</h2>

          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading products...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          ) : (
            <Row>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col
                    key={product._id}
                    md={4}
                    sm={6}
                    xs={12}
                    className="mb-4 d-flex"
                  >
                    <Card className="shadow-sm border-1 rounded-3 w-100 d-flex hover-shadow">
                      <Card.Img
                        variant="top"
                        src={product.image || `Not Found`}
                        className="p-3"
                        style={{
                          height: "250px",
                          objectFit: "cover",
                          width: "100%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleShowModal(product)}
                      />
                      <Card.Body className="text-center d-flex flex-column justify-content-between">
                        <Card.Title className="fw-semibold">
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          RS. {product.price} -{" "}
                          {product.stock ? "In Stock" : "Out of Stock"}
                          <br /> ⭐ {product.rating}
                        </Card.Text>
                        <Button
                          variant="dark"
                          className="mt-auto w-100"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart 🛒
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <h5 className="text-center text-danger">
                  No products found
                </h5>
              )}
            </Row>
          )}
        </Col>
      </Row>

      {/* Offcanvas for mobile filters */}
      <Offcanvas
        show={showFilters}
        onHide={() => setShowFilters(false)}
        placement="start"
        style={{ width: '250px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-3">{renderFilterPanel}</Offcanvas.Body>
      </Offcanvas>

      <ProductModal
        selectedProduct={selectedProduct}
        showModal={showModal}
        setShowModal={setShowModal}
        addToCart={addToCart}
      />
    </Container>
  );
};

export default ShopPage;
