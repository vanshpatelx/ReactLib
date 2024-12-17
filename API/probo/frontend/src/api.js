import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/signin`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/signup`, { email, password });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Register Error:', error);
    throw error;
  }
};
