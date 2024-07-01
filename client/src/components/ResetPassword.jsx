import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/ResetPassword.css'; 

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false);  // Loading state
    const navigate = useNavigate();

    const { email, newPassword } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reset-password`, formData);
            setAlert({ show: true, message: res.data.message || "Password reset successfully", variant: 'success' });
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);
        } catch (err) {
            setAlert({ show: true, message: err.response.data.message || 'Something went wrong', variant: 'danger' });
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Container className="reset-password-container">
            <Row className="justify-content-md-center">
                <Col md={8} lg={6} className="reset-password-form-col">
                    <h2 className="reset-password-title">Reset Password</h2>
                    {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>{alert.message}</Alert>}
                    <Form onSubmit={onSubmit} className="reset-password-form">
                        <Form.Group controlId="formEmail">
                            <Form.Label><strong>Email address</strong></Form.Label>
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
                            <Form.Label><strong>New Password</strong></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter new password"
                                name="newPassword"
                                value={newPassword}
                                onChange={onChange}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                                required
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="reset-password-button"
                            disabled={loading}  // Disable button during loading
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
