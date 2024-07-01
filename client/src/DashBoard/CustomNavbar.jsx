import React, { useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import logo1 from '../img/logo1.jpg';
import uploadFile from '../helper/uploadFile';

function CustomNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    role: '',
    status: '',
    profile_pic: ''
  });
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setEdit(false);
  const handleEdit = () => {
    setFormData({
      name: user.name,
      email: user.email,
      dob: formatDate(user.dob, true),
      role: user.role,
      status: user.status,
      profile_pic: user.profile_pic,
    });
    setEdit(true);
    setShow(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile-details`, {
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error fetching user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } catch (err) {
        console.error('Logout failed:', err.response?.data?.message || err.message);
      }
    }
  };

  const formatDate = (dateString, forInput = false) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return forInput ? `${year}-${month}-${day}` : `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSave = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/profile-edit`, formData,{
          headers: {
            Authorization: token,
          },
        });
        setUser(res.data);
        setEdit(false);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error updating user details');
      }
  };

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
    
    console.log(user)

  if (show && user) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={user.profile_pic} alt="profile" style={{borderRadius: '50%', marginLeft: '40%'}} width={100} height={100} />
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>DOB:</strong> {formatDate(user.dob)}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.status}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleEdit}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (edit && user) {
    return (
      <Modal show={edit} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                pattern='[A-Za-z ]{2,}'title='Must contain Alphabets'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Publisher">Publisher</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Moderator">Moderator</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Navbar className="custom-navbar">
      <Form inline>
        <Image src={logo1} rounded width={50} height={50} />
      </Form>
      <Form inline>
        <Row>
          <Col xs="auto">
            {user && <Image src={user.profile_pic} roundedCircle width={40} height={40} onClick={handleShow} />}
          </Col>
          <Col xs="auto">
            <Button type="submit" onClick={handleLogout}>Logout</Button>
          </Col>
        </Row>
      </Form>
    </Navbar>
  );
}

export default CustomNavbar;
