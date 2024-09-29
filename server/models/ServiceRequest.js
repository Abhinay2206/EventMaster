const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  serviceType: { type: String, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true,
});

const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);

module.exports = ServiceRequest;
