// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();  // Using useNavigate
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');  // Redirect to login page if no token exists
      return;
    }

    // Fetch user data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the token
    navigate('/login');  // Redirect to the login page after logout
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {userData.email}</p>
      <button onClick={handleLogout}>Logout</button>  {/* Logout button */}
    </div>
  );
};

export default Dashboard;
