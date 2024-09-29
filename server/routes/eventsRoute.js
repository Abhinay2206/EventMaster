const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

router.get('/list', async (req, res) => {
  try {
    const events = await Event.find().select('_id name description date time location ticketTypes');
    const formattedEvents = events.map(event => ({
      ...event._doc,
      date: event.date ? new Date(event.date).toLocaleDateString() : null,
      ticketTypes: event.ticketTypes.map(ticket => ({
        type: ticket.type,
        price: ticket.price,
        quantity: ticket.quantity
      }))
    }));
    res.json(formattedEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/new', async (req, res) => {
  try {
    const eventData = req.body;
    console.log(eventData);
    
    const requiredFields = ['name', 'location', 'ticketTypes'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    if (!Array.isArray(eventData.ticketTypes) || eventData.ticketTypes.length === 0) {
      return res.status(400).json({ error: 'At least one ticket type is required' });
    }

    for (const ticket of eventData.ticketTypes) {
      if (!ticket.type || !ticket.price || !ticket.quantity) {
        return res.status(400).json({ error: 'Each ticket type must have a type, price, and quantity' });
      }
    }

    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});


router.get('/:eventId/booked-seats', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(200).json(event.bookedSeats || []);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booked seats' });
  }
});

router.post('/:eventId/update-seats', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { bookedSeats } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    event.bookedSeats = [...(event.bookedSeats || []), ...bookedSeats];
    
    await event.save();

    res.status(200).json({ message: 'Seats successfully booked', bookedSeats: event.bookedSeats });
  } catch (error) {
    res.status(500).json({ error: 'Error updating booked seats' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
