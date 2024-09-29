const express = require('express');
const router = express.Router();
const Recipt = require('../models/Recipt')

router.post('/receipts', async (req, res) => {
    try {
        const newReceipt = new Recipt(req.body);
        await newReceipt.save();
        res.status(201).json(newReceipt);
    } catch (error) {
        res.status(500).send('Error creating receipt');
    }
});

router.get('/getReceipts/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const receipts = await Recipt.find({ email: email });
        if (receipts.length === 0) return res.status(404).send('No receipts found for this email');
        res.json(receipts);
    } catch (error) {
        res.status(500).send('Error fetching receipts');
    }
});

router.get('/getAllReceipts', async (req, res) => {
    try {
        const receipts = await Recipt.find();
        res.json(receipts);
    } catch (error) {
        res.status(500).send('Error fetching all receipts');
    }
});

module.exports = router;