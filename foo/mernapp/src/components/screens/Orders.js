import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      if (!userEmail) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`http://localhost:3000/api/orderData?email=${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Received orders data:', data);
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.message || 'Failed to fetch your orders. Please try again.');
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    try {
      if (!selectedOrder) {
        throw new Error('No order selected');
      }

      const response = await fetch('http://localhost:3000/api/processPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          order_id: selectedOrder.order_date,
          total_amount: selectedOrder.total_amount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment confirmation failed');
      }

      toast.success('Payment confirmed successfully!');
      setPaymentModalOpen(false);
      setSelectedOrder(null);
      // Refresh orders to show updated status
      fetchOrders();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(error.message || 'Failed to confirm payment. Please try again.');
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
              {order.status === 'pending' && (
                <div className='mt-3'>
                  <button
                    className='btn btn-success'
                    onClick={() => {
                      setSelectedOrder(order);
                      setPaymentModalOpen(true);
                    }}
                  >
                    Confirm Payment
                  </button>
                </div>
              )}
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
      <Dialog open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)}>
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <div className='text-center'>
            <h5>Total Amount: ₹{selectedOrder?.total_amount}</h5>
            <p>Order Date: {selectedOrder?.order_date}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePaymentConfirm} color="success" variant="contained">
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
