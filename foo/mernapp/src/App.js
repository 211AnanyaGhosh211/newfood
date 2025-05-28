import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Home from './components/screens/Home';
import Login from './components/screens/Login';
import Signup from './components/screens/Signup';
import Checkout from './components/screens/Checkout';

import React, { useContext } from 'react';
import { CartProvider } from './components/ContextReducer';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';



import Navbar from './components/Navbar';
function App() {
  return (
    <CartProvider>
      <PayPalScriptProvider 
        options={{
          "client-id": "YOUR_PAYPAL_CLIENT_ID",
          "components": "buttons"
        }}
      >
        <Router>
          <div>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/createuser" element={<Signup />} />
              <Route exact path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </Router>
      </PayPalScriptProvider>
    </CartProvider>
  );
}

export default App;
