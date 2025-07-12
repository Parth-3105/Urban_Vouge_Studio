import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const AuthForm = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setAlert({ show: true, message: "Login successful!", variant: "success" });
        navigate("/")
      } else {
        await signup(formData.name, formData.email, formData.password);
        setAlert({ show: true, message: "Signup successful!", variant: "success" });
        navigate("/")
      }
    } catch (error) {
      setAlert({ show: true, message: error.response.data.message || "An error occurred", variant: "danger" });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>
          <Button type="submit" variant="dark" className="w-100">{isLogin ? "Login" : "Sign Up"}</Button>
        </Form>
        <p className="mt-3 text-center">
          {isLogin ? "New user? " : "Already have an account? "}
          <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0">
            {isLogin ? "Sign Up" : "Login"}
          </Button>
        </p>
      </Card>
    </Container>
  );
};

export default AuthForm;
