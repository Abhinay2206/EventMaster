const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/getDetails/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/updateDetails/:email', async (req, res) => {
  const { name, mobileNumber, age, sex, address } = req.body;
  const email = req.params.email;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { name, mobileNumber, age, sex, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error); // Log the full error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;