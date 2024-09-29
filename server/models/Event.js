const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date },
  time: { type: String  },
  includeVipTickets: { type: Boolean, default: false }, 
  ticketTypes: [TicketTypeSchema], 
  location: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);
