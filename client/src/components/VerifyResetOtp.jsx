import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/VerifyResetOtp.css'; 

const VerifyResetOtp = () => {
    const [otp, setOtp] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [loading, setLoading] = useState(false); 
    const [timer, setTimer] = useState(60);  
    const [canResend, setCanResend] = useState(false);  
    const navigate = useNavigate();
    const location = useLocation();
    const {email} = location.state || {};
    console.log(email)

    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        } else {
            const countdown = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        setCanResend(true);
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(countdown);
        }
    }, [email, navigate]);

    const onChange = (e) => setOtp(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-reset-otp`, { code: otp, email });
            if (response.data.success) {
                setAlert({ show: true, message: 'OTP verified successfully!', variant: 'success' });
                setTimeout(() => {
                    navigate('/resetpassword', { state: { email } }); 
                }, 2000);
            } else {
                setAlert({ show: true, message: response.data.message || 'Invalid OTP', variant: 'danger' });
            }
        } catch (error) {
            setAlert({ show: true, message: error.response?.data?.message || 'Something went wrong', variant: 'danger' });
        } finally {
            setLoading(false);  
        }
    };

    const resendOtp = async () => {
        setCanResend(false);
        setTimer(60);  
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, { email });
            if (response.data.success) {
                setAlert({ show: true, message: 'OTP resent successfully!', variant: 'success' });
            } else {
                setAlert({ show: true, message: response.data.message || 'Failed to resend OTP', variant: 'danger' });
            }
        } catch (error) {
            setAlert({ show: true, message: error.response?.data?.message || 'Something went wrong', variant: 'danger' });
        }
    };

    return (
        <Container className="verify-otp-container">
            <Row className="justify-content-md-center">
                <Col md={8} lg={6} className="verify-otp-form-col">
                    <h2 className="verify-otp-title">Verify OTP</h2>
                    {alert.show && <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>{alert.message}</Alert>}
                    <Form onSubmit={onSubmit} className="verify-otp-form">
                        <Form.Group controlId="formOtp">
                            <Form.Label><strong>OTP :</strong></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={onChange}
                                required
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="verify-otp-button"
                            disabled={loading}  
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : 'Verify'}
                        </Button>
                    </Form>
                    <div className="resend-otp-container">
                        {canResend ? (
                            <Button variant="link" onClick={resendOtp} className="resend-otp-button">
                                Resend OTP
                            </Button>
                        ) : (
                            <p className="resend-otp-timer">Resend OTP in {timer}s</p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyResetOtp;
