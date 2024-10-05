import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardContent, Grid, Box, Divider, Button, Collapse, TextField, Select, MenuItem, FormControl, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { styled } from '@mui/system';
import { jsPDF } from "jspdf";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import QRCode from 'qrcode';

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
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');

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

  const showQRTicket = async (order) => {
    setSelectedOrder(order);
    try {
      const qrData = JSON.stringify({
        receiptId: order.receiptId,
        eventName: order.eventDetails.name,
        date: order.eventDetails.date,
        time: order.eventDetails.time,
        seats: order.selectedSeats,
        userName: order.userDetails.name
      });
      const dataURL = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });
      setQRCodeDataURL(dataURL);
      setOpenQRDialog(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleCloseQRDialog = () => {
    setOpenQRDialog(false);
    setSelectedOrder(null);
    setQRCodeDataURL('');
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
                <Box sx={{ mt: 2, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Receipt ID</Typography>
                      <Typography variant="body1" fontWeight="medium">{order.receiptId}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">Transaction ID</Typography>
                      <Typography variant="body1" fontWeight="medium">{order.transactionId}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Order Date</Typography>
                      <Typography variant="body1" fontWeight="medium">{order.date}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    User Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                      <Typography variant="body1" fontWeight="medium">{order.userDetails.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Payment Method</Typography>
                      <Typography variant="body1" fontWeight="medium">{order.userDetails.paymentMethod}</Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Selected Seats
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {order.selectedSeats.map((seat, index) => (
                      <Chip
                        key={index}
                        label={seat}
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          fontWeight: 'medium',
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="h5" align="right" sx={{ mt: 3, fontWeight: 'bold', color: 'success.main' }}>
                    Total Price: ₹{order.totalPrice.toFixed(2)}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => downloadReceipt(order)}
                      startIcon={<DownloadIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Download Receipt
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      onClick={() => showQRTicket(order)}
                      startIcon={<QrCodeIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Show QR Ticket
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </StyledCard>
        ))
      )}
      <Dialog 
        open={openQRDialog} 
        onClose={handleCloseQRDialog}
        PaperProps={{
          style: {
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
          },
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: 'primary.main',
          mb: 2
        }}>
          Digital Ticket
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {selectedOrder.eventDetails.name}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                width: '100%', 
                mb: 2 
              }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Date: {selectedOrder.eventDetails.date}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  Time: {selectedOrder.eventDetails.time}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, fontWeight: 'medium' }}>
                Seats: {selectedOrder.selectedSeats.join(', ')}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                {qrCodeDataURL && <img src={qrCodeDataURL} alt="QR Code" style={{ width: '200px', height: '200px' }} />}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseQRDialog}
            variant="contained"
            sx={{ 
              borderRadius: '20px', 
              px: 4,
              py: 1,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;