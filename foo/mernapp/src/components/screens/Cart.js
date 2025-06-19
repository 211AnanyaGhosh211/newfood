import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { useCart, useDispatchCart, refreshCart } from '../ContextReducer';

export default function Cart() {
  let navigate = useNavigate();
  let dispatch = useDispatchCart();
  
  // Refresh cart data on component mount
  useEffect(() => {
    const cartData = refreshCart();
    dispatch({ type: "LOAD", payload: cartData });
  }, [dispatch]);

  let data = useCart();
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3 text-color-white'>The Cart is Empty!</div>
      </div>
    )
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");
    let response = await fetch("http://localhost:3000/api/orderData", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_data: data,
        email: userEmail,
        order_date: new Date().toDateString()
      })
    });
    console.log("Order response:", response.status);
    return response;
  }



  let totalPrice = data.reduce((total, food) => {
    // Calculate price based on base price and quantity
    const basePrice = food.basePrice || food.price / food.qty;
    return total + (basePrice * food.qty);
  }, 0);

  const handleOrderPlacement = async () => {
    if (window.confirm('Are you sure you want to place this order?')) {
      try {
        let userEmail = localStorage.getItem("userEmail");
        
        // First create the order with pending status
        let response = await fetch("http://localhost:3000/api/orderData", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order_data: data,
            email: userEmail,
            order_date: new Date().toDateString(),
            total_amount: totalPrice
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        // Show payment confirmation modal
        const paymentConfirmation = window.confirm(`
          Your order has been created successfully!\n\n
          Order Amount: ₹${totalPrice}\n
          Please contact our customer support at +91 1234567890 to make the payment.\n
          After payment, click "Confirm Payment" to update your order status.
        `);

        if (paymentConfirmation) {
          // Process payment and update status
          const paymentResponse = await fetch("http://localhost:3000/api/processPayment", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: userEmail,
              order_id: new Date().toDateString(), // Using order_date as ID
              total_amount: totalPrice
            })
          });

          if (paymentResponse.ok) {
            dispatch({ type: "DROP" });
            toast.success('Order placed and payment confirmed!');
            navigate('/orders');
          } else {
            toast.error('Payment confirmation failed. Please try again.');
          }
        } else {
          toast.warning('Order created but payment not confirmed. Please complete payment later.');
          dispatch({ type: "DROP" });
          navigate('/orders');
        }
      } catch (error) {
        console.error('Error placing order:', error);
        toast.error('An error occurred. Please try again.');
      }
    }
  }

  return (
    <div>

      {console.log(data)}
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
        <table className='table table-hover '>
          <thead className=' text-success fs-4'>
            <tr>
              <th scope='col' >#</th>
              <th scope='col' >Name</th>
              <th scope='col' >Quantity</th>
              <th scope='col' >Option</th>
              <th scope='col' >Amount</th>
              <th scope='col' ></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}> 
                <th scope='row' >{index + 1}</th>
                <td >{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td ><button type="button" className="btn p-0"><DeleteIcon onClick={() => { dispatch({ type: "DELETE", id: food.id }) }} /></button> </td></tr>
            ))}
          </tbody>
        </table>
        <h1 className='fs-2' style={{ color: 'white' }}>Total Price: {totalPrice}/-</h1>

        <div className='mt-5'>
          <button className='btn btn-success' onClick={handleOrderPlacement}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
} 