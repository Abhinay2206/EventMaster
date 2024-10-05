import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Grid, Box, Divider, Button, Collapse, TextField, Select, MenuItem, FormControl, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import { jsPDF } from "jspdf";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        console.log(userEmail)
        if (!userEmail) {
          console.error('User email not found');
          return;
        }

        const response = await axios.get(`http://localhost:5007/api/getReceipts/${userEmail}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const downloadReceipt = (order) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Receipt', 105, 20, null, null, 'center');
    
    doc.setFontSize(12);
    doc.text(`Event: ${order.eventDetails.name}`, 20, 40);
    doc.text(`Date: ${order.eventDetails.date}`, 20, 50);
    doc.text(`Time: ${order.eventDetails.time}`, 20, 60);
    doc.text(`Receipt ID: ${order.receiptId}`, 20, 70);
    doc.text(`Transaction ID: ${order.transactionId}`, 20, 80);
    doc.text(`Order Date: ${order.date}`, 20, 90);
    doc.text(`User: ${order.userDetails.name}`, 20, 100);
    doc.text(`Payment Method: ${order.userDetails.paymentMethod}`, 20, 110);
    doc.text(`Selected Seats: ${order.selectedSeats.join(', ')}`, 20, 120);
    doc.text(`Total Price: $${order.totalPrice.toFixed(2)}`, 20, 130);
    
    doc.save(`receipt_${order.receiptId}.pdf`);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredAndSortedOrders = orders
    .filter(order => order.eventDetails.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'name':
          return a.eventDetails.name.localeCompare(b.eventDetails.name);
        default:
          return 0;
      }
    });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        My Orders
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
      {filteredAndSortedOrders.length === 0 ? (
        <Typography variant="body1">No orders found.</Typography>
      ) : (
        filteredAndSortedOrders.map((order) => (
          <StyledCard key={order.receiptId}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <Typography variant="h6" gutterBottom sx={{fontWeight: 'bold'}}>
                    {order.eventDetails.name}
                  </Typography>
                  <Typography variant="body2">
                    Date: {order.eventDetails.date} | Time: {order.eventDetails.time} | Seats: {order.selectedSeats.join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={() => toggleOrderExpansion(order.receiptId)}
                    endIcon={expandedOrder === order.receiptId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  >
                    {expandedOrder === order.receiptId ? 'Less' : 'More'}
                  </Button>
                </Grid>
              </Grid>
              <Collapse in={expandedOrder === order.receiptId}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1">
                    Receipt ID: {order.receiptId}
                  </Typography>
                  <Typography variant="body1">
                    Transaction ID: {order.transactionId}
                  </Typography>
                  <Typography variant="body1">
                    Order Date: {order.date}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    User Details:
                  </Typography>
                  <Typography variant="body1">
                    Name: {order.userDetails.name}
                  </Typography>
                  <Typography variant="body1">
                    Payment Method: {order.userDetails.paymentMethod}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Selected Seats:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {order.selectedSeats.map((seat, index) => (
                      <Typography key={index} variant="body2" sx={{ bgcolor: 'primary.light', p: 0.5, borderRadius: 1 }}>
                        {seat}
                      </Typography>
                    ))}
                  </Box>
                  <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                    Total Price: ₹{order.totalPrice.toFixed(2)}
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => downloadReceipt(order)}
                    sx={{ mt: 2 }}
                  >
                    Download Receipt
                  </Button>
                </Box>
              </Collapse>
            </CardContent>
          </StyledCard>
        ))
      )}
    </Container>
  );
};

export default OrdersPage;