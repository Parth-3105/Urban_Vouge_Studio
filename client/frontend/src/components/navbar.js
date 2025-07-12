import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Badge,
  Offcanvas,
} from "react-bootstrap";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import ChangeNameModal from "./changeNameModal";
import ChangePasswordModal from "./changePasswordModal";
import axios from "axios";


const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  console.log(user)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleNameUpdate = async (newName) => {
    const userId = JSON.parse(localStorage.getItem('user'))._id
    try {
      const { data } = await axios.put(`https://clothing-mern-project-server.onrender.com/api/auth/update`, { userId, newName });
      localStorage.setItem("user", JSON.stringify(data));
      setShowNameModal(false);
      alert("Profile Name Updated Successfully")
      window.location.reload();
    } catch (error) {
      console.log(error)
    }
  };

  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    const userId = JSON.parse(localStorage.getItem('user'))._id
    try {
      const res = await axios.put(`https://clothing-mern-project-server.onrender.com/api/auth/update`, { userId, currentPassword, newPassword });
      alert("Profile Password Updated Succesfully")
      handleLogout()
      setShowPasswordModal(false);
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold text-primary fs-4"
            style={{ fontFamily: "cursive" }}
          >
            👕 BrandStore
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" onClick={handleShow} />
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex justify-content-end">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="mx-2 text-dark fw-semibold">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop" className="mx-2 text-dark fw-semibold">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-2 text-dark fw-semibold">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="mx-2 text-dark fw-semibold">
                Contact
              </Nav.Link>

              <Button
                as={Link}
                to="/cart"
                variant="outline-primary"
                className="mx-2 d-flex align-items-center"
              >
                <FaShoppingCart className="me-1" /> Cart{" "}
                <Badge bg="primary" className="ms-1">

                </Badge>
              </Button>

              {user ? (
                <Dropdown align="end" className="ms-2">
                  <Dropdown.Toggle
                    variant="outline-primary"
                    id="profile-dropdown"
                    className="d-flex align-items-center"
                  >
                    <FaUserCircle size={22} className="me-2" />
                    <span className="d-none d-md-inline fw-semibold">Profile</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className="px-3 py-2 text-center">
                      <p className="mb-1 text-muted">Welcome,</p>
                      <h6
                        style={{
                          color: "#007bff",
                          fontWeight: "bold",
                          fontFamily: "cursive",
                        }}
                      >
                        {user.name}
                      </h6>
                    </div>
                    <Dropdown.Divider />
                    {user.admin ? (
                      <Dropdown.Item onClick={() => navigate("/admin")}>
                        💻 Admin Panel
                      </Dropdown.Item>) : null}
                    <Dropdown.Item onClick={() => navigate("/myorders")}>
                      📦 My Orders
                    </Dropdown.Item>
                    <div
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation(); // ✨ prevent dropdown from closing
                        setShowSettingsMenu(!showSettingsMenu);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      ⚙️ Settings
                    </div>
                    {/* Settings Submenu */}
                    {showSettingsMenu && (
                      <div className="px-3" style={{ marginLeft: "20px" }}>
                        <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
                          🔑 Change Password
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowNameModal(true)}>
                          ✏️ Change Name
                        </Dropdown.Item>
                      </div>
                    )}
                    <Dropdown.Divider />

                    <Dropdown.Item onClick={handleLogout}>
                      🚪 Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              ) : (
                <Button
                  as={Link}
                  to="/auth"
                  variant="primary"
                  className="ms-2 d-flex align-items-center"
                >
                  <FaUserCircle size={18} className="me-2" />
                  Login
                </Button>
              )}
              <>
                <ChangeNameModal
                  isOpen={showNameModal}
                  onClose={() => setShowNameModal(false)}
                  onSubmit={handleNameUpdate}
                />

                <ChangePasswordModal
                  isOpen={showPasswordModal}
                  onClose={() => setShowPasswordModal(false)}
                  onSubmit={handlePasswordUpdate}
                />
              </>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={handleClose} placement="start" className="d-lg-none navSide" style={{ width: '60%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose}>Home</Nav.Link>
            <Nav.Link as={Link} to="/shop" onClick={handleClose}>Shop</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleClose}>About</Nav.Link>
            <Nav.Link as={Link} to="/contact" onClick={handleClose}>Contact</Nav.Link>
          </Nav>

          <div className="mt-3 d-flex flex-column gap-2">
            {/* Cart Button */}
            <Button
              as={Link}
              to="/cart"
              variant="outline-primary"
              style={{maxWidth:'100px'}}
              className="d-flex align-items-center justify-content-center"
              size={18}
              onClick={handleClose}
            >
              <div><FaShoppingCart className="me-1" /> Cart</div>
              <Badge bg="primary" className="ms-1">
                {/* {cartItems.length} or any cart count */}
              </Badge>
            </Button>

            {/* If user logged in */}
            {user ? (
              <Dropdown>
                <Dropdown.Toggle variant="outline-primary" className="d-flex align-items-center">
                  <FaUserCircle className="me-2" size={22} />
                  <span>Profile</span>
                </Dropdown.Toggle>

                <Dropdown.Menu show={showSettingsMenu}>
                  <div className="px-3 py-2 text-center">
                    <p className="mb-1 text-muted">Welcome,</p>
                    <h6 className="text-primary fw-bold">{user.name}</h6>
                  </div>
                  <Dropdown.Divider />
                  {user.admin && (
                    <Dropdown.Item onClick={() => { navigate("/admin"); handleClose(); }}>
                      💻 Admin Panel
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={() => { navigate("/myorders"); handleClose(); }}>
                    📦 My Orders
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => {
                    e.stopPropagation(); // ✨ prevent dropdown from closing
                    setShowSettingsMenu(!showSettingsMenu);
                  }}>
                    ⚙️ Settings
                  </Dropdown.Item>

                  {/* Submenu under Settings */}
                  {showSettingsMenu && (
                    <div className="ps-4">
                      <Dropdown.Item onClick={() => setShowPasswordModal(true)}>
                        🔑 Change Password
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setShowNameModal(true)}>
                        ✏️ Change Name
                      </Dropdown.Item>
                    </div>
                  )}

                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => { handleLogout(); handleClose(); }}>
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // If user NOT logged in
              <Button
                as={Link}
                to="/auth"
                variant="primary"
                className="d-flex align-items-center justify-content-center"
                onClick={handleClose}
              >
                <FaUserCircle className="me-2" size={18} />
                Login
              </Button>
            )}

            {/* Modals */}
            <ChangeNameModal
              isOpen={showNameModal}
              onClose={() => setShowNameModal(false)}
              onSubmit={handleNameUpdate}
            />
            <ChangePasswordModal
              isOpen={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
              onSubmit={handlePasswordUpdate}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>

    </>


  );
};

export default NavigationBar;
