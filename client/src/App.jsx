import React from 'react';
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VerifyOtp from './components/VerifyOtp';
import VerifyResetOtp from './components/VerifyResetOtp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
function App() {
    return (
        <Router>
            <Container>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} /> 
                    <Route path="*" element={<Navigate to="/login" />} /> 
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/verify-otp" element={<VerifyOtp/>} />
                    <Route path="/forgot-password" element={<ForgotPassword/>} />
                    <Route path="/verify-reset-otp" element={<VerifyResetOtp/>} />
                    <Route path="/resetpassword" element={<ResetPassword />} />
                    <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
