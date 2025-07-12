import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, users, products, orders
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [orders, setOrders] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        users: 0,
        products: 0,
        orders: 0,
        revenue: 0,
    });
    const emptyProductObject = {
        name: '',
        price: '',
        category: '',
        brand: '',
        image: '',
        rating: 0,
        featured: false,
        stock: true,
        bestSeller: false,
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navigate = useNavigate();
    function handleLogout() {
        logout()
        navigate('/')
    };

    // Fetch Dashboard summary
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const usersRes = await axios.get('https://clothing-mern-project-server.onrender.com/api/auth');
                const productsRes = await axios.get('https://clothing-mern-project-server.onrender.com/api/products');
                const ordersRes = await axios.get('https://clothing-mern-project-server.onrender.com/api/order');
                const revenue = ordersRes.data.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)
                setDashboardData({
                    users: usersRes.data.length,
                    products: productsRes.data.length,
                    orders: ordersRes.data.length,
                    revenue: revenue,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchDashboardData();
    }, [activeSection == 'dashboard']);

    // Fetch section data
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeSection === 'users') {
                    const res = await axios.get('https://clothing-mern-project-server.onrender.com/api/auth');
                    setUsers(res.data);
                } else if (activeSection === 'products') {
                    const res = await axios.get('https://clothing-mern-project-server.onrender.com/api/products');
                    setProducts(res.data);
                } else if (activeSection === 'orders') {
                    const res = await axios.get('https://clothing-mern-project-server.onrender.com/api/order');
                    setOrders(res.data);
                }
            } catch (error) {
                console.error('Error fetching section data:', error);
            }
        };
        fetchData();
    }, [activeSection]);

    // Delete handlers
    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`https://clothing-mern-project-server.onrender.com/api/auth/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`https://clothing-mern-project-server.onrender.com/api/products/${id}`);
            setProducts(products.filter(product => product._id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleDeleteOrder = async (id) => {
        try {
            await axios.delete(`https://clothing-mern-project-server.onrender.com/api/order/${id}`);
            setOrders(orders.filter(order => order._id !== id));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct({ ...product });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const addProduct = async (product) => {
        product.category = product.category.toLowerCase();
        product.category = product.category.charAt(0).toUpperCase() + product.category.slice(1);
        console.log(product.category)
        try {
            await axios.post(`http://localhost:5000/api/products/add`, product);
            alert("Product Added Successfully");
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };


    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (editingProduct._id) {
            try {
                await axios.put(`https://clothing-mern-project-server.onrender.com/api/products/${editingProduct._id}`, editingProduct);
                const updatedProducts = products.map(p =>
                    p._id === editingProduct._id ? editingProduct : p
                );
                setProducts(updatedProducts);
                handleCloseModal();
                alert('Product updated successfully!');
            } catch (error) {
                console.error(error);
                alert('Failed to update product.');
            }
        } else {
            addProduct(editingProduct)
            handleCloseModal();
        }
    };

    return (
        <div className="d-flex">

            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="bg-primary text-white p-4" style={{ width: "250px", minHeight: "100vh" }}>
                    <h2 className="mb-5">Admin Panel</h2>
                    <ul className="nav flex-column gap-3">
                        <li className="nav-item">
                            <button onClick={() => setActiveSection('dashboard')} className="nav-link text-white btn btn-link">Dashboard</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => setActiveSection('users')} className="nav-link text-white btn btn-link">Users</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => setActiveSection('products')} className="nav-link text-white btn btn-link">Products</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => setActiveSection('orders')} className="nav-link text-white btn btn-link">Orders</button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: "100vh" }}>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center bg-white p-3 mb-4 rounded shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <button onClick={toggleSidebar} className="btn btn-outline-primary">
                            {isSidebarOpen ? "Hide" : "Show"} Menu
                        </button>
                        <h4 className="mb-0 text-capitalize">{activeSection}</h4>
                    </div>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>

                {/* Section Content */}
                {activeSection === 'dashboard' && (
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Users</h5>
                                    <p className="card-text display-6">{dashboardData.users}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Products</h5>
                                    <p className="card-text display-6">{dashboardData.products}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Orders</h5>
                                    <p className="card-text display-6">{dashboardData.orders}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 mb-4">
                            <div className="card text-center shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Revenue (RS.)</h5>
                                    <p className="card-text display-6">{dashboardData.revenue}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Section */}
                {activeSection === 'users' && (
                    <div className="bg-white p-4 rounded shadow-sm">
                        <h5>Users List</h5>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {/* <button className="btn btn-warning btn-sm me-2">Edit</button> */}
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Products Section */}
                {activeSection === 'products' && (
                    <div className="bg-white p-4 rounded shadow-sm">
                        <h5>Products List</h5>
                        <div style={{ display: 'flex', justifyContent: 'right', width: '100%', margin: '1% 0%' }}>
                            <button className="btn btn-info btn-sm me-2" onClick={() => handleEditClick(emptyProductObject)}>
                                Add Product
                            </button>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>RS. {product.price}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(product)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(product._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Product Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                    <Form onSubmit={handleUpdateProduct}>
                        {editingProduct?._id ?
                            (<Modal.Header closeButton className="bg-warning text-dark">
                                <Modal.Title>Edit Product</Modal.Title>
                            </Modal.Header>)
                            :
                            (<Modal.Header closeButton className="bg-info text-dark">
                                <Modal.Title>Add Product</Modal.Title>
                            </Modal.Header>)}


                        <Modal.Body className="bg-light">
                            {editingProduct && (
                                <div className="container">
                                    <div className="row g-3">
                                        {/* Name */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Label className="w-50 fw-bold">Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingProduct.name}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                            />
                                        </div>

                                        {/* Price */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Label className="w-50 fw-bold">Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.01"
                                                value={editingProduct.price}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Label className="w-50 fw-bold">Category</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingProduct.category}
                                                style={{ textTransform: 'capitalize' }}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                            />
                                        </div>

                                        {/* Brand */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Label className="w-50 fw-bold">Brand</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingProduct.brand}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                            />
                                        </div>

                                        {/* Image */}
                                        <div className="col-md-12 d-flex align-items-center">
                                            <Form.Label className="w-25 fw-bold">Image (base64)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingProduct.image}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Label className="w-50 fw-bold">Rating</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.1"
                                                value={editingProduct.rating}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, rating: e.target.value })}
                                            />
                                        </div>

                                        {/* Featured */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Check
                                                type="checkbox"
                                                label="Featured"
                                                checked={editingProduct.featured}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                                            />
                                        </div>

                                        {/* Stock */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Check
                                                type="checkbox"
                                                label="In Stock"
                                                checked={editingProduct.stock}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.checked })}
                                            />
                                        </div>
                                        {/* Best Seller */}
                                        <div className="col-md-6 d-flex align-items-center">
                                            <Form.Check
                                                type="checkbox"
                                                label="Best Seller"
                                                checked={editingProduct.bestSeller}
                                                onChange={(e) => setEditingProduct({ ...editingProduct, bestSeller: e.target.checked })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>

                        <Modal.Footer className="bg-light">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            {editingProduct?._id ?
                                <Button variant="warning" type="submit">Update Product</Button>
                                :
                                <Button variant="info" type="submit">Add Product</Button>}
                        </Modal.Footer>
                    </Form>
                </Modal>


                {/* Orders Section */}
                {activeSection === 'orders' && (
                    <div className="card p-4 bg-white shadow-sm">
                        <h4 className="mb-4">Orders List</h4>
                        <table className="table table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Customer Name</th>
                                    <th>Total Price</th>
                                    <th>Products</th>
                                    <th>Address</th>
                                    <th>Payment Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        <td>{order.user}</td>
                                        <td>RS. {order.totalAmount}</td>
                                        <td>
                                            <ul className="list-unstyled">
                                                {order.products.map(product => (
                                                    <li key={product.id}>
                                                        {product.name} (RS. {product.price})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td>
                                            {/* 🏠 Address Display */}
                                            {order.address ? (
                                                <div>
                                                    <strong>{order.address.fullName}</strong><br />
                                                    {order.address.street}<br />
                                                    {order.address.city}, {order.address.state} - {order.address.zip}<br />
                                                    {order.address.country}<br />
                                                    📞 {order.address.phone}
                                                </div>
                                            ) : (
                                                <span>No Address</span>
                                            )}
                                        </td>
                                        <td>
                                            {order.paymentStatus}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOrder(order._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default AdminDashboard;
