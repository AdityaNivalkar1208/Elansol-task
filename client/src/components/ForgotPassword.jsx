import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/ForgotPassword.css';  // Import the custom CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const navigate = useNavigate();

    const onChange = (e) => setEmail(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, { email });
            if (res.data.success) {
                setAlert({ show: true, message: res.data.message, variant: 'success' });
                setTimeout(() => {
                    navigate('/verify-reset-otp', { state: { email:email } });
                }, 2000);  // Redirect after 2 seconds to allow users to read the message
            } else {
                setAlert({ show: true, message: res.data.message, variant: 'danger' });
            }
        } catch (err) {
            setAlert({ show: true, message: err.response.data.message || 'Something went wrong', variant: 'danger' });
        }
    };

    return (
        <Container className="forgot-password-container">
            <Row className="justify-content-md-center">
                <Col md={8} lg={6} className="forgot-password-form-col">
                    <h2 className="forgot-password-title">Forgot Password</h2>
                    {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
                    <Form onSubmit={onSubmit} className="forgot-password-form">
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="forgot-password-button">
                            Send OTP
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;
