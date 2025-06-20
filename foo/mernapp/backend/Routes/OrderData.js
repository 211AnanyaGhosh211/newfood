const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')

// Ensure Mongoose is properly connected
const mongoose = require('mongoose');
if (!mongoose.connection.readyState) {
    console.error('❌ MongoDB not connected!');
    process.exit(1);
}

// Handle new order creation
router.post('/orderData', async (req, res) => {
    try {
        const { email, order_data, order_date, total_amount, payLater } = req.body;
        
        if (!email || !order_data || !order_date || !total_amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const existingOrder = await Order.findOne({ email });
        
        // Format the order data
        const formattedOrder = {
            Order_date: order_date,
            total_amount: total_amount,
            status: payLater ? 'pending' : 'ordered',
            items: order_data
        };

        if (!existingOrder) {
            // Create new order
            await Order.create({
                email,
                order_data: [formattedOrder],
                total_amount,
                status: payLater ? 'pending' : 'ordered'
            });
        } else {
            // Update existing order
            await Order.findOneAndUpdate(
                { email },
                {
                    $push: { order_data: formattedOrder },
                    $set: { total_amount, status: payLater ? 'pending' : 'ordered' }
                }
            );
        }

        res.json({ success: true, order_id: order_date });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Process payment and update order status
router.post('/processPayment', async (req, res) => {
    try {
        const { email, order_id, total_amount } = req.body;
        
        // Find the user's orders
        const userOrders = await Order.findOne({ email });
        if (!userOrders) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the specific order's status
        const updatedOrders = userOrders.order_data.map(order => {
            if (order.Order_date === order_id && order.status === 'pending') {
                order.status = 'ordered';
            }
            return order;
        });

        // Update the database
        await Order.findOneAndUpdate(
            { email },
            { $set: { order_data: updatedOrders } }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

// Get user orders with status
router.get('/orderData', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        console.log('Fetching orders for email:', email);
        
        const orders = await Order.findOne({ email });
        console.log('Orders found:', orders ? orders.order_data.length : 0);
        
        if (!orders) {
            console.log('No orders found for this user');
            return res.json([]);
        }

        // Format orders data with status
        const formattedOrders = orders.order_data.map((order, index) => ({
            order_date: order.Order_date,
            total_amount: order.total_amount,
            order_data: order.items,
            status: order.status,
            id: index + 1
        }));

        console.log('Formatted orders:', formattedOrders);
        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            error: 'Failed to fetch orders', 
            details: error.message 
        });
    }
});

module.exports = router;