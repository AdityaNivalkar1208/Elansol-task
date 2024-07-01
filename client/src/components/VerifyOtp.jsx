import React, { useState ,useEffect} from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const navigate = useNavigate();
    const location = useLocation();
    const {email} = location.state || {};
    console.log(email);

     useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [ email, navigate ]);
    

    const onChange = (e) => setOtp(e.target.value);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = localStorage.getItem('userEmail'); 
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`, { email, code: otp });
            if (res.data.success) {
                localStorage.removeItem('userEmail'); 
                setAlert({ show: true, message: 'OTP verified successfully! Redirecting...', variant: 'success' });
                setTimeout(() => {
                    navigate('/login');
                }, 2000);  
            }
        } catch (err) {
            setAlert({ show: true, message: err.response.data.error || 'An error occurred', variant: 'danger' });
        }
    };

    return (
        <Container className="verify-otp-container">
            <Row className="justify-content-md-center">
                <Col md={6} className="verify-otp-form-col">
                    <h2 className="verify-otp-title">Verify OTP</h2>
                    {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
                    <Form onSubmit={onSubmit} className="verify-otp-form">
                        <Form.Group controlId="formOtp">
                            <Form.Label>OTP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={onChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="verify-otp-button">
                            Verify
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default VerifyOtp;
