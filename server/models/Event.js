const mongoose = require('mongoose');

const TicketTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  sold: { type: Number, default: 0 }
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date },
  time: { type: String  },
  includeVipTickets: { type: Boolean, default: false }, 
  ticketTypes: [TicketTypeSchema], 
  location: { type: String, required: true },
  bookedSeats: { type: [String], default: [] }
});

EventSchema.methods.bookTickets = async function(ticketTypeId, quantity) {
  const ticketType = this.ticketTypes.id(ticketTypeId);
  if (!ticketType) {
    throw new Error('Ticket type not found');
  }
  if (ticketType.quantity - ticketType.sold < quantity) {
    throw new Error('Not enough tickets available');
  }
  ticketType.sold += quantity;
  await this.save();
};

module.exports = mongoose.model('Event', EventSchema);
