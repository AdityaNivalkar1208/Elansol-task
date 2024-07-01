import React, { useEffect, useState } from 'react';
import { Container, Table, Pagination } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../DashBoard/CustomNavbar';
import defaultImage from '../img/defaultImage.png';
import '../style/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { IoSettingsSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 5;
    const navigate = useNavigate();

    const formatDate = (dateString, forInput = false) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return forInput ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/all-user`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setUsers(res.data); 
                setTotalPages(Math.ceil(res.data.length / usersPerPage));
            } catch (err) {
                console.error(err.response ? err.response.data.message : 'Error fetching user details');
            }
        };

        fetchUsers();
    }, [navigate]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'green';
            case 'Inactive':
                return 'yellow';
            case 'Suspended':
                return 'red';
            default:
                return 'gray';
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    // Paginate users
    const paginatedUsers = users.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    return (
        <div className="dashboard-container">
            <CustomNavbar />
            <Container className="dashboard-content" style={{ width: '100%',display: 'flex',flexDirection:"column"}}>
                <Table striped bordered hover className="dashboard-table">
                    <thead style={{ textAlign: 'center' }}>
                        <tr>
                            <th>Sr.No</th>
                            <th>Name</th>
                            <th>Date Created</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                        {Array.isArray(paginatedUsers) && paginatedUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                                <td style={{display: 'flex', flexDirection:'row',justifyContent: 'left',alignItems: 'center',gap:"1rem",paddingLeft:"10rem"}}>
                                    <img
                                        src={user.profile_pic || defaultImage}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '30px', height: '30px'}}
                                    />
                                    <span>{user.name}</span>
                                </td>
                                <td>{formatDate(user.date_created)}</td>
                                <td>{capitalizeFirstLetter(user.role)}</td>
                                <td>
                                    <span
                                        className="status-indicator"
                                        style={{ backgroundColor: getStatusColor(user.status), display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                    {user.status}
                                </td>
                                <td>
                                    <IoSettingsSharp style={{ color: "blue", fontSize: "1.3rem", marginRight: "1rem" }} />
                                    <MdCancel style={{ color: "red", fontSize: "1.3rem" }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                        <Pagination.Item
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                </Pagination>
            </Container>
        </div>
    );
};

export default Dashboard;
