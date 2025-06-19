import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      // Update each order with its status
      const updatedOrders = data.map(order => ({
        ...order,
        status: order.status || 'Pending'
      }));
      setOrders(updatedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container text-center mt-5'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className='container text-center mt-5'>
        <h3>No orders found</h3>
        <button
          className='btn btn-primary mt-3'
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className='container mt-5'>
        <h2 className='mb-4'>Your Orders</h2>
        
        {orders.map((order, index) => (
          <div key={index} className='card mb-4'>
            <div className='card-body'>
              <div className='d-flex justify-content-between align-items-center mb-3'>
                <h5 className='card-title'>Order #{index + 1}</h5>
                <span className={`badge ${order.status === 'ordered' ? 'bg-success' : 'bg-warning'}`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <p className='card-text'>
                <strong>Order Date:</strong> {order.order_date}<br />
                <strong>Total Amount:</strong> ₹{order.total_amount}
              </p>
              
              <h6 className='mt-3'>Order Items:</h6>
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_data.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        <div className='text-center mt-4'>
          <button
            className='btn btn-primary'
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
