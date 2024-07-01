import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Login.css';  // Import the custom CSS file

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, formData);
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setAlert({ show: true, message: 'Login successful!', variant: 'success' });
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1000);  // Redirect after 1 second
            }
        } catch (err) {
            setAlert({ show: true, message: err.response?.data?.message || 'Something went wrong', variant: 'danger' });
        }
    };

    return (
        <Container className="login-container">
            {alert.show && 
                <Alert 
                    variant={alert.variant} 
                    onClose={() => setAlert({ ...alert, show: false })} 
                    className="alert-top-right"
                >
                    {alert.message}
                </Alert>
            }
            <Row className="justify-content-md-center">
                <Col md={8} lg={6} className="login-form-col">
                    <h2 className="login-title">Login</h2>
                    
                    <Form onSubmit={onSubmit} className="login-form">
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </Form.Group>

                        <div className="login-options">
                            <Link to="/register" className="btn btn-link">
                                Sign Up
                            </Link>
                            <Link to="/forgot-password" className="btn btn-link">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button variant="primary" type="submit" className="login-button">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
