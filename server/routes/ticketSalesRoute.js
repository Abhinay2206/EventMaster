const express = require('express');
const router = express.Router();
const TicketSale = require('../models/TicketSale');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const sales = await TicketSale.find().populate('event', 'name').populate('user', 'name');
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;