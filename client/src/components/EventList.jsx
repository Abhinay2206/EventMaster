/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography, Grid, Container, Dialog, DialogTitle, DialogContent, DialogActions, Box, FormControl, TextField, Collapse, Paper, Select, MenuItem, Divider, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import { motion, AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  width: '400px'
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '24px',
});

const EventTitle = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: '1.5rem',
  marginBottom: '16px',
});

const EventInfo = styled(Typography)({
  fontFamily: "'Roboto', sans-serif",
  fontSize: '0.9rem',
  marginBottom: '8px',
  color: '#555',
});

const EventDescription = styled(Typography)({
  fontFamily: "'Roboto', sans-serif",
  fontSize: '1rem',
  marginBottom: '16px',
  color: '#333',
});

const BookButton = styled(Button)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
  borderRadius: '8px',
  padding: '8px 16px',
  left: '130px',
  textTransform: 'none',
});

const SeatButton = styled(Button)(({ theme, selected, ticketType, booked }) => ({
  minWidth: '40px',
  minHeight: '40px',
  margin: '4px',
  borderRadius: '8px',
  backgroundColor: booked ? theme.palette.error.main :
    selected ? theme.palette.primary.main : 
    ticketType === 'VIP' ? theme.palette.secondary.light : theme.palette.grey[300],
  color: booked ? theme.palette.error.contrastText :
    selected ? theme.palette.primary.contrastText : 
    ticketType === 'VIP' ? theme.palette.secondary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: booked ? theme.palette.error.dark :
      selected ? theme.palette.primary.dark : 
      ticketType === 'VIP' ? theme.palette.secondary.main : theme.palette.grey[400],
  },
  '&:disabled': {
    backgroundColor: booked ? theme.palette.error.main : theme.palette.action.disabledBackground,
    color: booked ? theme.palette.error.contrastText : theme.palette.action.disabled,
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  // eslint-disable-next-line no-dupe-keys
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
  },
}));

const PaymentMethodCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[4],
  },
}));

const SeatSelectionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
}));

const SeatLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  '& > div': {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
  },
}));

const LegendItem = styled(Box)(({ color }) => ({
  width: '20px',
  height: '20px',
  backgroundColor: color,
  marginRight: '8px',
  borderRadius: '4px',
}));

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    bank: '',
    email: '',
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [bookedSeats, setBookedSeats] = useState({});
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5007/api/events/list');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        
        // Fetch booked seats for all events
        const bookedSeatsPromises = data.map(event => 
          fetch(`http://localhost:5007/api/events/${event._id}/booked-seats`)
            .then(res => res.json())
        );
        const bookedSeatsResults = await Promise.all(bookedSeatsPromises);
        const bookedSeatsMap = {};
        data.forEach((event, index) => {
          bookedSeatsMap[event._id] = bookedSeatsResults[index];
        });
        setBookedSeats(bookedSeatsMap);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
    setSelectedSeats([]);
    setShowPayment(false);
    setShowReceipt(false);
    setShowPaymentSuccess(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setShowPayment(false);
    setShowReceipt(false);
    setShowPaymentSuccess(false);
    setPaymentMethod('');
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      bank: '',
      email: '',
    });
  };

  const handleSeatSelection = (seatId) => {
    if (bookedSeats[selectedEvent._id].includes(seatId)) {
      return; 
    }
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatId)) {
        return prevSelectedSeats.filter((seat) => seat !== seatId);
      } else {
        return [...prevSelectedSeats, seatId];
      }
    });
  };

  const handleConfirmBooking = () => {
    setShowPayment(true);
  };

  const handleBackToSeats = () => {
    setShowPayment(false);
    setShowReceipt(false);
    setShowPaymentSuccess(false);
    setPaymentMethod('');
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      bank: '',
      email: '',
    });
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      bank: '',
      email: '',
    });
  };

  const handlePaymentDetailsChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const calculateTotalPrice = () => {
    if (!selectedEvent) return 0;
    return selectedSeats.reduce((total, seatId) => {
      const [, ticketType] = seatId.split('-');
      const ticket = selectedEvent.ticketTypes.find(t => t.type === ticketType);
      return total + (ticket ? ticket.price : 0);
    }, 0);
  };

  const generateSeats = (ticketTypes) => {
    const seats = [];
    const sortedTicketTypes = ticketTypes.sort((a, b) => {
      if (a.type === 'VIP') return -1;
      if (b.type === 'VIP') return 1;
      return 0;
    });

    let rowCounter = 0;
    sortedTicketTypes.forEach((ticketType) => {
      const rows = Math.ceil(Math.sqrt(ticketType.quantity));
      const cols = Math.ceil(ticketType.quantity / rows);

      seats.push(
        <Typography key={`${ticketType.type}-title`} variant="h6" style={{ marginTop: '16px', marginBottom: '8px' }}>
          {ticketType.type} Seats
        </Typography>
      );

      for (let i = 0; i < rows; i++) {
        const row = [];
        const rowName = String.fromCharCode(65 + rowCounter);
        for (let j = 0; j < cols; j++) {
          if (row.length < ticketType.quantity) {
            const seatId = `${rowName}${j + 1}-${ticketType.type}`;
            const isBooked = bookedSeats[selectedEvent._id]?.includes(seatId);
            row.push(
              <SeatButton
                key={seatId}
                onClick={() => handleSeatSelection(seatId)}
                selected={selectedSeats.includes(seatId)}
                ticketType={ticketType.type}
                booked={isBooked}
                disabled={isBooked}
              >
                {`${rowName}${j + 1}`}
              </SeatButton>
            );
          }
        }
        seats.push(
          <Box key={`${ticketType.type}-${rowName}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" style={{ marginRight: '8px' }}>{rowName}</Typography>
            {row}
          </Box>
        );
        rowCounter++;
      }
      // Add column numbers
      const columnNumbers = Array.from({ length: cols }, (_, i) => i + 1);
      seats.push(
        <Box key={`${ticketType.type}-columns`} style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <Typography variant="body2" style={{ width: '24px' }}></Typography>
          {columnNumbers.map(num => (
            <Typography key={num} variant="body2" style={{ width: '48px', textAlign: 'center' }}>{num}</Typography>
          ))}
        </Box>
      );
    });

    return seats;
  };

  const generateReceipt = async () => {
    const receiptId = Math.random().toString(36).substr(2, 9);
    const transactionId = Math.random().toString(36).substr(2, 16);
    const currentDate = new Date();
    
    const receiptData = {
      receiptId,
      transactionId,
      email: paymentDetails.email,
      userDetails: {
        name: paymentDetails.nameOnCard || 'Guest User',
        paymentMethod,
      },
      selectedSeats,
      eventDetails: {
        name: selectedEvent.name,
        date: new Date(selectedEvent.date).toLocaleDateString(),
        time: selectedEvent.time,
      },
      totalPrice: calculateTotalPrice(),
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
    };

    try {
      const response = await fetch('http://localhost:5007/api/receipts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData),
      });

      if (!response.ok) {
        throw new Error('Failed to send receipt to server');
      }

      const savedReceipt = await response.json();
      setReceipt(savedReceipt);

      setShowPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentSuccess(false);
        setShowReceipt(true);
      }, 2000);

      const updatedBookedSeats = [...(bookedSeats[selectedEvent._id] || []), ...selectedSeats];
      setBookedSeats(prevBookedSeats => ({
        ...prevBookedSeats,
        [selectedEvent._id]: updatedBookedSeats
      }));

      await fetch(`http://localhost:5007/api/events/${selectedEvent._id}/update-seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookedSeats: selectedSeats }),
      });

      setEvents(prevEvents => 
        prevEvents.map(event => 
          event._id === selectedEvent._id
            ? {
                ...event,
                ticketTypes: event.ticketTypes.map(type => ({
                  ...type,
                  quantity: type.quantity - selectedSeats.filter(seat => seat.includes(type.type)).length
                }))
              }
            : event
        )
      );

    } catch (error) {
      console.error('Error sending receipt to server:', error);
      alert('An error occurred while processing your payment. Please try again.');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredAndSortedEvents = events
    .filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return Math.min(...a.ticketTypes.map(t => t.price)) - Math.min(...b.ticketTypes.map(t => t.price));
        default:
          return 0;
      }
    });

  const handleShareEvent = (event) => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: `Check out this event: ${event.name}`,
        url: `${window.location.origin}/event/${event._id}`,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported');
      // Fallback behavior for browsers that don't support Web Share API
      alert(`Share this link: ${window.location.origin}/event/${event._id}`);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{  fontWeight: 400,my: 4, marginBottom: '32px' }}>
        Available Events
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,  
        borderRadius: '16px', 
        padding: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff'
      }}>
        <TextField
          placeholder="Search events..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            marginRight: 2,
            '& .MuiOutlinedInput-root': {
              height: '48px',
              borderRadius: '24px',
              backgroundColor: 'white',
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
          }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Sort by' }}
            sx={{
              height: '48px',
              borderRadius: '24px',
              backgroundColor: 'white',
              borderColor: 'rgba(0, 0, 0, 0.23)',
            }}
          >
            <MenuItem value="" disabled>
              <em>Sort by</em>
            </MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        {filteredAndSortedEvents.map((event) => (
          <Grid item key={event._id} xs={12} sm={6}>
            <StyledCard>
              <StyledCardContent>
                <EventTitle>{event.name}</EventTitle>
                <EventDescription>{event.description}</EventDescription>
                <EventInfo>Date: {new Date(event.date).toLocaleDateString()}</EventInfo>
                <EventInfo>Time: {event.time}</EventInfo>
                <EventInfo>Location: {event.location}</EventInfo>
                {event.ticketTypes.map((ticketType) => (
                  <EventInfo key={ticketType.type}>
                    {ticketType.type}: ₹{ticketType.price} ({ticketType.quantity} available)
                  </EventInfo>
                ))}
              </StyledCardContent>
              <CardActions sx={{ padding: '16px', justifyContent: 'space-between' }}>
                <BookButton size="medium" variant="contained" color="primary" onClick={() => handleBookNow(event)}>
                  Book Now
                </BookButton>
                <IconButton onClick={() => handleShareEvent(event)} color="primary">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Button startIcon={<ArrowBackIcon />} onClick={showPayment ? handleBackToSeats : handleCloseDialog}>
            Back
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && !showPayment && !showReceipt && !showPaymentSuccess && (
            <SeatSelectionContainer>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.name}
              </Typography>
              <SeatLegend>
                <div>
                  <LegendItem color="#1976d2" />
                  <Typography variant="body2">Selected</Typography>
                </div>
                <div>
                  <LegendItem color="#f44336" />
                  <Typography variant="body2">Booked</Typography>
                </div>
                <div>
                  <LegendItem color="#f50057" />
                  <Typography variant="body2">VIP</Typography>
                </div>
                <div>
                  <LegendItem color="#bdbdbd" />
                  <Typography variant="body2">Available</Typography>
                </div>
              </SeatLegend>
              <Box sx={{ overflowX: 'auto', width: '100%' }}>
                {generateSeats(selectedEvent.ticketTypes)}
              </Box>
              <Typography variant="body1" style={{ marginTop: '16px' }}>
                Selected Seats: {selectedSeats.join(', ')}
              </Typography>
            </SeatSelectionContainer>
          )}
          {showPayment && !showReceipt && !showPaymentSuccess && (
            <Box sx={{ padding: '24px', backgroundColor: '#f8f9fa', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '20px' }}>
                Payment Details
              </Typography>
              <Box sx={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Typography variant="body1" gutterBottom sx={{ color: '#4a4a4a' }}>
                  Selected Seats: <strong>{selectedSeats.join(', ')}</strong>
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: '#2196f3', fontWeight: 600 }}>
                  Total Price: ₹{calculateTotalPrice().toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom sx={{ marginTop: '28px', color: '#1a1a1a', fontWeight: 600 }}>
                Choose Payment Method
              </Typography>
              <Grid container spacing={3}>
                {['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Digital Wallet'].map((method) => (
                  <Grid item xs={12} sm={6} key={method}>
                    <PaymentMethodCard
                      elevation={paymentMethod === method ? 8 : 1}
                      onClick={() => handlePaymentMethodChange(method)}
                      sx={{
                        backgroundColor: paymentMethod === method ? '#e3f2fd' : '#fff',
                        borderColor: paymentMethod === method ? '#2196f3' : 'transparent',
                        borderWidth: 2,
                        borderStyle: 'solid',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 20px rgba(33,150,243,0.15)',
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: paymentMethod === method ? '#2196f3' : '#4a4a4a' }}>{method}</Typography>
                    </PaymentMethodCard>
                  </Grid>
                ))}
              </Grid>
              <Collapse in={!!paymentMethod} sx={{ marginTop: '28px' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      variant="outlined"
                      name="email"
                      value={paymentDetails.email}
                      onChange={handlePaymentDetailsChange}
                      required
                      sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                    />
                  </Grid>
                  {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          variant="outlined"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handlePaymentDetailsChange}
                          sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Expiry Date"
                          variant="outlined"
                          name="expiryDate"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentDetailsChange}
                          sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="CVV"
                          variant="outlined"
                          name="cvv"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentDetailsChange}
                          sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Name on Card"
                          variant="outlined"
                          name="nameOnCard"
                          value={paymentDetails.nameOnCard}
                          onChange={handlePaymentDetailsChange}
                          sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                        />
                      </Grid>
                    </>
                  )}
                  {paymentMethod === 'Net Banking' && (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Select
                          value={paymentDetails.bank}
                          onChange={handlePaymentDetailsChange}
                          name="bank"
                          displayEmpty
                          sx={{ backgroundColor: '#fff', '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' } } }}
                        >
                          <MenuItem value="" disabled>Select a bank</MenuItem>
                          <MenuItem value="SBI">State Bank of India</MenuItem>
                          <MenuItem value="HDFC">HDFC Bank</MenuItem>
                          <MenuItem value="ICICI">ICICI Bank</MenuItem>
                          <MenuItem value="Axis">Axis Bank</MenuItem>
                          <MenuItem value="PNB">Punjab National Bank</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  {(paymentMethod === 'UPI' || paymentMethod === 'Digital Wallet') && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={`Enter ${paymentMethod} Details`}
                        variant="outlined"
                        name="upiOrWallet"
                        value={paymentDetails.upiOrWallet}
                        onChange={handlePaymentDetailsChange}
                        placeholder={
                          paymentMethod === 'UPI' ? 'Enter UPI ID' :
                          'Enter Wallet Name'
                        }
                        sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Promo Code"
                      variant="outlined"
                      name="promoCode"
                      value={paymentDetails.promoCode || ''}
                      onChange={handlePaymentDetailsChange}
                      placeholder="Enter promo code (optional)"
                      sx={{ backgroundColor: '#fff', '& .MuiOutlinedInput-root': { '&:hover fieldset': { borderColor: '#2196f3' }, } }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Box>
          )}
          <AnimatePresence>
            {showPaymentSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  padding: '2rem',
                }}
              >
                <CheckCircleOutlineIcon style={{ fontSize: 80, color: '#4CAF50' }} />
                <Typography variant="h5" style={{ marginTop: '1rem', color: '#4CAF50' }}>
                  Payment Successful!
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          {showReceipt && receipt && (
            <Box sx={{ backgroundColor: '#f5f5f5', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333', marginBottom: '20px' }}>Receipt</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Receipt ID: <span style={{ color: '#333' }}>{receipt.receiptId}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Transaction ID: <span style={{ color: '#333' }}>{receipt.transactionId}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Email: <span style={{ color: '#333' }}>{receipt.email}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>User: <span style={{ color: '#333' }}>{receipt.userDetails.name}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Payment Method: <span style={{ color: '#333' }}>{receipt.userDetails.paymentMethod}</span></Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Event: <span style={{ color: '#333' }}>{receipt.eventDetails.name}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Date: <span style={{ color: '#333' }}>{receipt.eventDetails.date}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Time: <span style={{ color: '#333' }}>{receipt.eventDetails.time}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Selected Seats: <span style={{ color: '#333' }}>{receipt.selectedSeats.join(', ')}</span></Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#555' }}>Total Price: <span style={{ color: '#333', fontWeight: 600 }}>₹{receipt.totalPrice}</span></Typography>
                </Grid>
              </Grid>
              <Divider sx={{ margin: '20px 0' }} />
              <Typography variant="body2" sx={{ color: '#777', textAlign: 'right' }}>
                Payment made on {receipt.date} at {receipt.time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {!showPayment && !showReceipt && !showPaymentSuccess && (
            <Button onClick={handleConfirmBooking} color="primary" variant="contained" disabled={selectedSeats.length === 0}>
              Proceed to Payment
            </Button>
          )}
          {showPayment && !showReceipt && !showPaymentSuccess && (
            <Button onClick={generateReceipt} color="primary" variant="contained" disabled={!paymentMethod || !paymentDetails.email || (paymentMethod === 'Net Banking' && !paymentDetails.bank) || (paymentMethod !== 'Net Banking' && !Object.values(paymentDetails).some(Boolean))}>
              Confirm Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventList;