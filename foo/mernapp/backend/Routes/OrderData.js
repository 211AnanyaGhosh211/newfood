const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')

// Handle new order creation
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    console.log("1231242343242354",req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
            console.log("1231242343242354",req.body.email)
            await Order.create({
                email: req.body.email,
                order_data: data.map(item => ({
                    ...item,
                    status: req.body.payLater ? 'pending' : 'ordered'
                })),
                total_amount: req.body.total_amount,
                status: req.body.payLater ? 'pending' : 'ordered'
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { 
                    $push: { 
                        order_data: data.map(item => ({
                            ...item,
                            status: req.body.payLater ? 'pending' : 'ordered'
                        }))
                    }, 
                    $set: { 
                        total_amount: req.body.total_amount, 
                        status: req.body.payLater ? 'pending' : 'ordered' 
                    } 
                }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})

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
            if (order[0].Order_date === order_id) { // Using Order_date as ID since we don't have a unique ID
                order[0].status = 'Ordered';
                return order;
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
router.post('/orders', async (req, res) => {
    try {
        const { email } = req.body;
        const orders = await Order.findOne({ email });
        
        if (!orders) {
            return res.json([]);
        }

        // Format orders data with status
        const formattedOrders = orders.order_data.map((orderData, index) => ({
            order_date: orderData[0].Order_date,
            total_amount: orderData[0].total_amount || orders.total_amount,
            order_data: orderData.slice(1),
            status: orderData[0].status || 'Pending',
            id: index + 1
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get user orders with status
router.post('/orders', async (req, res) => {
    try {
        const { email } = req.body;
        const orders = await Order.findOne({ email });
        
        if (!orders) {
            return res.json([]);
        }

        // Format orders data
        const formattedOrders = orders.order_data.map((orderData, index) => ({
            order_date: orderData[0].Order_date,
            total_amount: orders.total_amount,
            order_data: orderData.slice(1),
            status: orderData.status || 'Pending',
            id: index + 1
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router

// Get user orders
router.post('/orders', async (req, res) => {
    try {
        const { email } = req.body;
        const orders = await Order.findOne({ email });
        
        if (!orders) {
            return res.json([]);
        }

        // Format orders data
        const formattedOrders = orders.order_data.map((orderData, index) => ({
            order_date: orderData[0].Order_date,
            total_amount: orders.total_amount,
            order_data: orderData.slice(1),
            status: 'Pending',
            id: index + 1
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router