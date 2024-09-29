const mongoose = require('mongoose');

const TicketSaleSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TicketSale', TicketSaleSchema);