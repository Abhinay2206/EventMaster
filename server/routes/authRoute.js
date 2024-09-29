const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, mobileNumber, password: hashedPassword });
    await user.save();
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role
      }, 
      'sUfcZ9aTEM1Ko4IE2SpJUq6esJqCO8juEBcUrbhPyAU', 
      { expiresIn: '10h' }
    );
    res.json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email, password, role);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if (user.role !== role) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const token = jwt.sign(
      { 
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role
      }, 
      'sUfcZ9aTEM1Ko4IE2SpJUq6esJqCO8juEBcUrbhPyAU', 
      { expiresIn: '10h' }
    );
    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;