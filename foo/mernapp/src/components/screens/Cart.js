import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material'
import { toast } from 'react-toastify'
import { useCart, useDispatchCart, refreshCart } from '../ContextReducer'

export default function Cart() {
  let navigate = useNavigate()
  let dispatch = useDispatchCart()
  const [openModal, setOpenModal] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Refresh cart data on component mount
  useEffect(() => {
    const cartData = refreshCart()
    dispatch({ type: "LOAD", payload: cartData })
  }, [dispatch])

  let data = useCart()
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3 text-color-white'>The Cart is Empty!</div>
      </div>
    )
  }

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail")
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
    })
    console.log("Order response:", response.status)
    return response
  }

  let totalPrice = data.reduce((total, food) => {
    // Calculate price based on base price and quantity
    const basePrice = food.basePrice || food.price / food.qty;
    return total + (basePrice * food.qty);
  }, 0);

  const handleOrderPlacement = async () => {
    setOpenModal(true)
  }

  const handleConfirmOrder = async () => {
    try {
      let userEmail = localStorage.getItem("userEmail")
      
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
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const orderData = await response.json()
      setOrderId(orderData.order_id)
      setPaymentModalOpen(true)
      setOpenModal(false)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('An error occurred. Please try again.')
      setOpenModal(false)
    }
  }

  const handlePaymentConfirm = async () => {
    try {
      let userEmail = localStorage.getItem("userEmail")
      
      const paymentResponse = await fetch("http://localhost:3000/api/processPayment", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          order_id: orderId,
          total_amount: totalPrice
        })
      })

      if (paymentResponse.ok) {
        dispatch({ type: "DROP" })
        toast.success('Order placed and payment confirmed!')
        navigate('/orders')
      } else {
        toast.error('Payment confirmation failed. Please try again.')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      toast.error('An error occurred while confirming payment. Please try again.')
    } finally {
      setPaymentModalOpen(false)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false)
    navigate('/orders')
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

        {/* Order Confirmation Modal */}
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Order</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                Are you sure you want to place this order?
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Amount: ₹{totalPrice}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please contact our customer support at +91 1234567890 to make the payment.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmOrder} color="success" variant="contained">
              Confirm Order
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Confirmation Modal */}
        <Dialog open={paymentModalOpen} onClose={handleClosePaymentModal} maxWidth="sm" fullWidth>
          <DialogTitle>Payment Confirmation</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" gutterBottom>
                Order Successfully Created!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Order ID: {orderId}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Total Amount: ₹{totalPrice}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please contact our customer support at +91 1234567890 to make the payment.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                After payment, click "Confirm Payment" to update your order status.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePaymentModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handlePaymentConfirm} color="success" variant="contained">
              Confirm Payment
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
} 