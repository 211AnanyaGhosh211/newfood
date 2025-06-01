import React from 'react';
import { useDispatchCart } from '../ContextReducer';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const dispatch = useDispatchCart();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Clear all user data from localStorage
    localStorage.removeItem('authtoken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    // Dispatch logout action to clear cart state
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to login page
    navigate('/login');
  }, [dispatch, navigate]);

  return null; // This component will be used as a route redirect
}
