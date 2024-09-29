const mongoose = require('mongoose')

const reciptSchema =  new mongoose.Schema({
    receiptId: String,
    transactionId: String,
    email: String,
    userId: String,  
    userDetails: {
        name: String,
        paymentMethod: String
    },
    selectedSeats: [String],
    eventDetails: {
        name: String,
        date: String,
        time: String
    },
    totalPrice: Number,
    date: String,
    time: String
});

module.exports = mongoose.model('Recipt', reciptSchema);