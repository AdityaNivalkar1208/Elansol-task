import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Toast, ToastContainer, Container, Navbar } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import uploadFile from '../helper/uploadFile';
import '../style/Register.css';  // Import the custom CSS file

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        email: '',
        password: '',
        role: 'reviewer',
        profile_pic: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const [uploadPhoto, setUploadPhoto] = useState(null);
    const [showToast, setShowToast] = useState(false);  // State for toast visibility
    const [toastMessage, setToastMessage] = useState(''); // State for toast message
    const [toastType, setToastType] = useState('');  // State for toast type (success/error)
    const navigate = useNavigate();

    const { name, dob, email, password, role, profile_pic } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];
        setUploadPhoto(file);

        try {
            const uploadPhotoResponse = await uploadFile(file);
            setFormData((prev) => ({
                ...prev,
                profile_pic: uploadPhotoResponse?.url
            }));
        } catch (error) {
            setAlert({ show: true, message: 'Failed to upload photo', variant: 'danger' });
        }
    };

    const handleClearUploadPhoto = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setUploadPhoto(null);
        setFormData((prev) => ({
            ...prev,
            profile_pic: ''
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, formData);
            if (res.data.success) {
                setToastMessage('OTP has been sent to your email!');
                setToastType('success');
                setShowToast(true);  
                setTimeout(() => {
                    navigate('/verify-otp',{ state: { email:formData.email } });
                }, 2000); 
            }
        } catch (err) {
            setToastMessage(err.response.data.message || 'Something went wrong');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false)
            }, 2000);
        }
    };

    return (
            <Container className="register-container">
                <Row className="justify-content-md-center">
                    <Col className="register-form-col">  {/* Adjusted form column size */}
                        <h2 className="register-title">Register</h2>
                        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
                        <Form onSubmit={onSubmit} className='form'>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    pattern='[A-Za-z ]{2,}'title='Must contain Alphabets'
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formDob">
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dob"
                                    value={dob}
                                    onChange={onChange}
                                    required
                                />
                            </Form.Group>

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
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"

                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="publisher">Publisher</option>
                                    <option value="reviewer">Reviewer</option>
                                    <option value="moderator">Moderator</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formProfilePic">
                                <Form.Label>Profile Picture</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="profile_pic"
                                    onChange={handleUploadPhoto}
                                    required
                                />
                                {uploadPhoto && (
                                    <div className="uploaded-photo-info">
                                        <p>File: {uploadPhoto.name}</p>
                                        <Button variant="danger" onClick={handleClearUploadPhoto}>
                                            Clear
                                        </Button>
                                    </div>
                                )}
                            </Form.Group>

                            <div className="form-actions">
                                <Button variant="primary" type="submit" className="register-button">
                                    Register
                                </Button>
                            </div>
                        </Form>
                        
                        <div className="login-link">
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>

                        {/* Toast Container for notifications */}
                        <ToastContainer
                            position="top-end"  // Position toast at the top-right corner
                            className="p-3 toast-container"  // Added custom class for positioning
                        >
                            <Toast
                                show={showToast}
                                onClose={() => setShowToast(false)}
                                style={{
                                    backgroundColor: toastType === 'success' ? 'lightgreen' : 'red',  // Green for success, red for error
                                    color: 'white'
                                }}
                            >
                                <Toast.Body>{toastMessage}</Toast.Body>
                            </Toast>
                        </ToastContainer>
                    </Col>
                </Row>
            </Container>
    );
};

export default Register;
