import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Tabs, Tab, Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination, Navigation } from "swiper/modules";
import axios from "axios";
import ProductModal from "../components/detailsModal";
import { useCart } from "../context/cartContext";

const HomePage = () => {
  // const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Track selected product
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const { addToCart } = useCart();



  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const res = await axios.get("https://clothing-mern-project-server.onrender.com/api/products");
        // setProducts(res.data);

        // Filter Best Sellers
        setBestSellers(res.data.filter((product) => product.bestSeller));
        // Filter featured products
        setFeaturedProducts(res.data.filter((product) => product.featured));

        // Filter New Arrivals (Products from last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        setNewArrivals(
          res.data.filter((product) => new Date(product.createdAt) >= thirtyDaysAgo)
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Dummy customer reviews
  const testimonials = [
    { id: 1, text: "Amazing quality! I love my new outfit!", customer: "Sarah" },
    { id: 2, text: "Super fast shipping and great service.", customer: "Alex" }
  ];

  return (
    <Container fluid>
      {/* Hero Section */}
      <Row className="text-white text-center py-5" style={{
        background: "linear-gradient(135deg, #ff6f61, #de1f83)",
        color: "#fff",
      }}>
        <Col>
          <h1 style={{ fontWeight: "700", fontSize: "3rem" }}>Discover Your Style</h1>
          <p className="mb-4" style={{ fontSize: "1.25rem" }}>Shop the latest trends with our exclusive collection.</p>
          <Button variant="light" size="lg" style={{ fontWeight: "600", color: "#de1f83" }}><a href="/shop" style={{textDecoration:'none'}}>Shop Now</a></Button>
        </Col>
      </Row>

      {/* Featured Products */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <Swiper
          spaceBetween={15}
          slidesPerView={4}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Pagination, Navigation]}
          breakpoints={{
            1200: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
          style={{ paddingBottom: "20px" }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product._id} style={{ display: "flex", justifyContent: "center" }}>
              <Card
                className="h-100 d-flex flex-column shadow-sm border-1"
                style={{
                  maxWidth: "250px",
                  margin: "auto",
                  borderRadius: "15px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <Card.Img
                  variant="top"
                  src={product.image || "https://via.placeholder.com/200"}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column" style={{ minHeight: "150px" }}>
                  {/* Truncate Product Name */}
                  <Card.Title
                    className="text-center"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={product.name} // Show full name on hover
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-center">RS. {product.price.toFixed(2)}</Card.Text>
                  <Button variant="dark" className="mt-auto" onClick={() => handleViewDetails(product)}>View Details</Button>
                </Card.Body>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
      <Container>
        <ProductModal
          selectedProduct={selectedProduct}
          showModal={showModal}
          setShowModal={setShowModal}
          addToCart={addToCart}
        />
      </Container>
      {/* Best Sellers & New Arrivals */}
      <Container className="my-5">
        <h2 className="text-center mb-4" style={{ fontWeight: "700", fontSize: "2rem", color: "#222" }}>
          🌟 Featured Collection
        </h2>
        <Tabs defaultActiveKey="bestsellers" className="mb-3">

          {/* Best Sellers Tab */}
          <Tab eventKey="bestsellers" title="Best Sellers">
            {bestSellers.length > 0 ? (
              <Swiper
                spaceBetween={15}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  1200: { slidesPerView: 4 },
                  768: { slidesPerView: 3 },
                  576: { slidesPerView: 2 },
                  0: { slidesPerView: 1 },

                }}
                style={{ paddingBottom: "20px" }}
              >
                {bestSellers.map((product) => (
                  <SwiperSlide key={product._id}>
                    <Card className="h-100 d-flex flex-column shadow" style={{ maxWidth: "250px", margin: "auto" }}>
                      <Card.Img
                        variant="top"
                        src={product.image || "https://via.placeholder.com/200"}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title
                          className="text-center"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-center">RS. {product.price.toFixed(2)}</Card.Text>
                        <Button variant="dark" className="mt-auto" onClick={() => handleViewDetails(product)}>View Details</Button>
                      </Card.Body>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center">No best sellers found.</p>
            )}
          </Tab>

          {/* New Arrivals Tab */}
          <Tab eventKey="newarrivals" title="New Arrivals">
            {newArrivals.length > 0 ? (
              <Swiper
                spaceBetween={15}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                modules={[Pagination, Navigation]}
                breakpoints={{
                  1200: { slidesPerView: 4 },
                  768: { slidesPerView: 3 },
                  576: { slidesPerView: 2 },
                  0: { slidesPerView: 1 },
                }}
                style={{ paddingBottom: "20px" }}
              >
                {newArrivals.map((product) => (
                  <SwiperSlide key={product._id}>
                    <Card className="h-100 d-flex flex-column shadow" style={{ maxWidth: "250px", margin: "auto" }}>
                      <Card.Img
                        variant="top"
                        src={product.image || "https://via.placeholder.com/200"}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title
                          className="text-center"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-center">RS. {product.price.toFixed(2)}</Card.Text>
                        <Button variant="dark" className="mt-auto" onClick={() => handleViewDetails(product)}>View Details</Button>
                      </Card.Body>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center">No new arrivals in the last 30 days.</p>
            )}
          </Tab>

        </Tabs>
      </Container>

      {/* Customer Testimonials */}
      <Container className="my-5 text-center">
        <h2 className="mb-4" style={{ fontWeight: "600" }}>❤️ What Our Customers Say</h2>
        <Carousel indicators={false} controls={false} fade>
          {testimonials.map((review) => (
            <Carousel.Item key={review.id}>
              <blockquote className="blockquote">
                <p className="mb-4 fst-italic">"{review.text}"</p>
                <footer className="blockquote-footer">- {review.customer}</footer>
              </blockquote>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>


      {/* Categories Section */}
      <Container className="text-center my-5">
        <h2>Shop by Category</h2>
        <Row className="mt-4">
          {['Men', 'Women', 'Accessories'].map((category) => (
            <Col key={category} md={4} className="mb-3">
              <Card className="p-4 bg-light shadow-sm border-1" style={{ borderRadius: "15px" }}>
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.5rem", fontWeight: "600" }}>{category}</Card.Title>
                  <Button variant="outline-dark" size="sm" href="/shop">Explore</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Newsletter Signup */}
      <Row className="text-white text-center py-5" style={{
        background: "linear-gradient(135deg, #343a40, #495057)",
      }}>
        <Col>
          <h4 className="mb-3">Subscribe for Updates</h4>
          <div className="d-flex justify-content-center align-items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control w-50 me-2"
              style={{ maxWidth: "300px", borderRadius: "30px" }}
            />
            <Button variant="light" style={{ borderRadius: "30px", fontWeight: "500", color: "#343a40" }}>
              Subscribe
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
