
const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    order_data: [{
        Order_date: {
            type: String,
            required: true
        },
        total_amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'ordered'],
            default: 'pending'
        },
        items: [{
            name: String,
            qty: Number,
            price: Number
        }]
    }],
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'ordered'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
