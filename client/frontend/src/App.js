import './App.css';
import HomePage from './Pages/home';
import NavigationBar from './components/navbar';
import ShopPage from './Pages/shoppage';
import CartPage from './Pages/cartpage';
import AuthForm from './components/authForm';
import AuthProvider from "./context/AuthContext";
import Checkout from './components/checkout';
import UserOrders from './components/userOrders';
import AdminDashboard from './Pages/adminDashboard';
import About from './components/about';
import ContactUs from './components/contactUs';
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <Router>

        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/admin']; // routes where you want to hide Navbar

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavigationBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myorders" element={<UserOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
        <ToastContainer/>
    </>
  );
}

export default App;
