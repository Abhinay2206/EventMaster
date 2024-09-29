import { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, FormControlLabel, Switch, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, CardContent, CardActions, Box, IconButton, Chip, Tooltip } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { motion } from 'framer-motion';

const StyledCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
  },
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '24px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: '30px',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 20px',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)',
  },
}));

const EventCreation = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    includeVipTickets: false,
    ticketTypes: [{ type: 'General', price: '', quantity: '' }],
    location: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5007/api/events/list');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setSnackbarMessage('Failed to fetch events. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const handleTicketChange = (index, field, value) => {
    if (field === 'price' && value < 0) return;
    if (field === 'quantity' && value < 0) return;
    setEventDetails(prevDetails => {
      const updatedTicketTypes = [...prevDetails.ticketTypes];
      updatedTicketTypes[index] = { ...updatedTicketTypes[index], [field]: value };
      return { ...prevDetails, ticketTypes: updatedTicketTypes };
    });
  };

  const handleVipTicketChange = (e) => {
    const includeVipTickets = e.target.checked;
    setEventDetails(prevDetails => {
      let updatedTicketTypes = [...prevDetails.ticketTypes];
      if (includeVipTickets) {
        updatedTicketTypes = [{ type: 'VIP', price: '', quantity: '' }, ...updatedTicketTypes];
      } else {
        updatedTicketTypes = updatedTicketTypes.filter(ticket => ticket.type !== 'VIP');
      }
      return { ...prevDetails, includeVipTickets, ticketTypes: updatedTicketTypes };
    });
  };

  const resetForm = () => {
    setEventDetails({
      name: '',
      description: '',
      date: '',
      time: '',
      includeVipTickets: false,
      ticketTypes: [{ type: 'General', price: '', quantity: '' }],
      location: ''
    });
  };

  const createEvent = async () => {
    try {
      const response = await fetch('http://localhost:5007/api/events/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create event');
      }
      
      // eslint-disable-next-line no-unused-vars
      const data = await response.json();
      setSnackbarMessage('Event created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setOpenDialog(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      setSnackbarMessage(error.message || 'Failed to create event. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5007/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));

      setSnackbarMessage('Event deleted successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbarMessage('Failed to delete event. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Event Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
          >
            Create Event
          </StyledButton>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold', color: '#555' }}>
        Event List
      </Typography>
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <StyledCard
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <StyledCardContent>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
                  {event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon sx={{ mr: 1, color: '#666' }} />
                  <Typography variant="body2" color="text.primary">
                    {event.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTimeIcon sx={{ mr: 1, color: '#666' }} />
                  <Typography variant="body2" color="text.primary">
                    {event.time}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1, color: '#666' }} />
                  <Typography variant="body2" color="text.primary">
                    {event.location}
                  </Typography>
                </Box>
              </StyledCardContent>
              <CardActions sx={{ justifyContent: 'space-between', padding: '16px' }}>
                <Chip label={`${event.ticketTypes.length} Ticket Types`} color="primary" variant="outlined" />
                <Tooltip title="Delete Event">
                  <IconButton onClick={() => handleDeleteEvent(event._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ '& .MuiTextField-root': { my: 1 } }}>
            <TextField
              label="Event Name"
              name="name"
              fullWidth
              value={eventDetails.name}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <TextField
              label="Event Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={eventDetails.description}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
            <TextField
              label="Event Date"
              type="date"
              name="date"
              fullWidth
              value={eventDetails.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ pattern: "\\d{4}-\\d{2}-\\d{2}" }}
              required
              variant="outlined"
            />
            <TextField
              label="Event Time"
              type="time"
              name="time"
              fullWidth
              value={eventDetails.time}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={eventDetails.includeVipTickets}
                  onChange={handleVipTicketChange}
                  name="includeVipTickets"
                />
              }
              label="Include VIP Tickets"
            />
            {eventDetails.ticketTypes.map((ticket, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6}>
                  <TextField
                    label={`${ticket.type} Ticket Price`}
                    type="number"
                    fullWidth
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label={`${ticket.type} Ticket Quantity`}
                    type="number"
                    fullWidth
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                    required
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            ))}
            <TextField
              label="Event Location"
              name="location"
              fullWidth
              value={eventDetails.location}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={createEvent} variant="contained" color="primary">
            Create Event
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EventCreation;
