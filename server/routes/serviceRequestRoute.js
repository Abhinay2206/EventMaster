const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

router.post('/service-requests', async (req, res) => {
  try {
    const { name, email, phoneNumber, serviceType, description } = req.body;
    const newRequest = new ServiceRequest({ name, email, phoneNumber, serviceType, description });
    await newRequest.save();
    res.status(201).json({ message: 'Service request submitted successfully' });
  } catch (error) {
    console.error('Error submitting service request:', error);
    res.status(500).json({ message: 'Error submitting service request' });
  }
});

router.get('/getAll-service-requests/:email', async (req, res) => {
  try {
    const { email } = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const serviceRequests = await ServiceRequest.find({ email });
    res.status(200).json(serviceRequests);
  } catch (error) {
    console.error('Error retrieving service requests:', error);
    res.status(500).json({ message: 'Error retrieving service requests' });
  }
});

router.get('/getAll-service-requests', async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find();
    res.status(200).json(serviceRequests);
  } catch (error) {
    console.error('Error retrieving all service requests:', error);
    res.status(500).json({ message: 'Error retrieving all service requests' });
  }
});

module.exports = router;
