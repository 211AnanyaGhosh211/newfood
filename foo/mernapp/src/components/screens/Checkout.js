import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useCart, useDispatchCart } from '../ContextReducer';

export default function Checkout() {
  let data = useCart();
  let dispatch = useDispatchCart();
  const [formData, setFormData] = useState({
    name: '',
    email: localStorage.getItem('userEmail') || '',
    phone: '',
    address: '',
    paymentMethod: 'paypal',
    deliveryInstructions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalPrice.toString()
        }
      }]
    });
  };

  const onApprove = async (data, actions) => {
    const response = await fetch("http://localhost:3000/api/orderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        user_details: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          delivery_instructions: formData.deliveryInstructions
        },
        payment_method: formData.paymentMethod,
        order_date: new Date().toDateString()
      })
    });

    if (response.status === 200) {
      dispatch({ type: "DROP" });
      if (formData.paymentMethod === 'paypal') {
        alert('Payment successful! Your order has been placed.');
      } else {
        alert('Order placed successfully! You will pay cash on delivery.');
      }
    } else {
      alert('Failed to place order. Please try again.');
    }
  };

  const totalPrice = data.reduce((total, food) => total + Number(food.price), 0);

  if (data.length === 0) {
    return (
      <div className='container mt-5'>
        <div className='alert alert-info'>Your cart is empty!</div>
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Checkout</h2>
      <div className='row'>
        <div className='col-md-8'>
          <div className='card mb-4'>
            <div className='card-body'>
              <h5 className='card-title'>Order Summary</h5>
              <div className='list-group'>
                {data.map((food, index) => (
                  <div key={index} className='list-group-item'>
                    <div className='d-flex justify-content-between'>
                      <div>
                        <h6 className='mb-1'>{food.name}</h6>
                        <small>Quantity: {food.qty}</small>
                      </div>
                      <span>${food.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-3'>
                <h5>Total: ${totalPrice}</h5>
              </div>
            </div>
          </div>
          
          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Delivery Details</h5>
              <form>
                <div className='mb-3'>
                  <label htmlFor='name' className='form-label'>Full Name</label>
                  <input 
                    type='text' 
                    className='form-control' 
                    id='name' 
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='phone' className='form-label'>Phone Number</label>
                  <input 
                    type='tel' 
                    className='form-control' 
                    id='phone' 
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='mb-3'>
                  <label htmlFor='address' className='form-label'>Delivery Address</label>
                  <textarea 
                    className='form-control' 
                    id='address' 
                    name='address'
                    rows='3'
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className='mb-3'>
                  <label htmlFor='deliveryInstructions' className='form-label'>Delivery Instructions</label>
                  <textarea 
                    className='form-control' 
                    id='deliveryInstructions' 
                    name='deliveryInstructions'
                    rows='2'
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className='col-md-4'>
          <div className='card mb-4'>
            <div className='card-body'>
              <h5 className='card-title'>Payment Method</h5>
              <div className='mb-3'>
                <div className='form-check'>
                  <input 
                    className='form-check-input' 
                    type='radio' 
                    name='paymentMethod' 
                    id='paypal' 
                    value='paypal'
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                  />
                  <label className='form-check-label' htmlFor='paypal'>
                    PayPal
                  </label>
                </div>
                <div className='form-check'>
                  <input 
                    className='form-check-input' 
                    type='radio' 
                    name='paymentMethod' 
                    id='cod' 
                    value='cod'
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />
                  <label className='form-check-label' htmlFor='cod'>
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='card-body'>
              <h5 className='card-title'>Payment</h5>
              {formData.paymentMethod === 'paypal' && (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'pill',
                    label: 'paypal',
                    tagline: false
                  }}
                />
              )}
              {formData.paymentMethod === 'cod' && (
                <div className='alert alert-info'>
                  You will pay cash when the order is delivered.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
