import axios from 'axios';
import { setAuthToken } from '../../utils/setAuthToken';

// Load User
export const loadUser = async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({ type: 'USER_LOADED', payload: res.data });
  } catch (err) {
    dispatch({ type: 'AUTH_ERROR' });
  }
};

// Register User
export const register = async (dispatch, formData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/auth/register', formData, config);
    dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
    loadUser(dispatch);
  } catch (err) {
    dispatch({ type: 'REGISTER_FAIL' });
  }
};

// Login User
export const login = async (dispatch, formData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/auth/login', formData, config);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
    loadUser(dispatch);
  } catch (err) {
    dispatch({ type: 'LOGIN_FAIL' });
  }
};

// Logout
export const logout = (dispatch) => {
  dispatch({ type: 'LOGOUT' });
};

// Update User Profile
export const updateUser = async (dispatch, formData) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put('/api/user', formData, config);
    dispatch({ type: 'USER_LOADED', payload: res.data });
    alert('Profile updated successfully!');
  } catch (err) {
    console.error(err.message);
    dispatch({ type: 'AUTH_ERROR' });
    alert('Error updating profile.');
  }
};