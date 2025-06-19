import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css'
import './App.css';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Logout from './components/screens/Logout';
import ForgotPassword from './components/screens/ForgotPassword.js';
import Orders from './components/screens/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useContext } from 'react';
import { CartProvider } from './components/ContextReducer';
import Navbar from './components/Navbar';
function App() {
  return (
    <div>
      <CartProvider>
        <Router>
          <div>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/createuser" element={<Signup />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/resetpassword" element={<ForgotPassword />} />
              <Route exact path="/orders" element={<Orders />} />
              <Route exact path="/myorders" element={<Orders />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

