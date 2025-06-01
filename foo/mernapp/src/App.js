import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.css'
import './App.css';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Checkout from './components/screens/Checkout';
import Logout from './components/screens/Logout';
import ForgotPassword from './components/screens/ForgotPassword.js';

import React, { useContext } from 'react';
import { CartProvider } from './components/ContextReducer';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';



import Navbar from './components/Navbar';
function App() {
  return (
    <CartProvider>
      <PayPalScriptProvider 
        options={{
          "client-id": "sb",
          "currency": "USD",
          "intent": "capture",
          "disable-funding": "credit",
          "components": "buttons",
          "vault": false,
          "commit": true,
          "debug": true,
          "locale": "en_US",
          "buyer-country": "US",
          "merchant-country": "US",
          "allowed-country-codes": ["US", "GB", "CA"],
          "disable-card": true
        }}
      >
        <Router>
          <div>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/createuser" element={<Signup />} />
              <Route exact path="/checkout" element={<Checkout />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/resetpassword" element={<ForgotPassword />} />
            </Routes>
          </div>
        </Router>
      </PayPalScriptProvider>
    </CartProvider>
  );
}

export default App;

