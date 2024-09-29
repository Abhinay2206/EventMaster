import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';

const ServiceRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    serviceType: '',
    description: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [previousRequests, setPreviousRequests] = useState([]);

  useEffect(() => {
    const fetchPreviousRequests = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        if (!userEmail) {
          console.error('User email not found');
          return;
        }
        const response = await axios.get(`http://localhost:5007/api/get-service-requests/${userEmail}`);
        setPreviousRequests(response.data);
      } catch (error) {
        console.error('Error fetching previous service requests:', error);
      }
    };

    fetchPreviousRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5007/api/service-requests', formData);
      setOpenSnackbar(true);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        serviceType: '',
        description: '',
      });
      // Refresh the list of previous requests
      const userEmail = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:5007/api/getAll-service-requests/${userEmail}`);
      setPreviousRequests(response.data);
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Service Request
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="phoneNumber"
          label="Phone Number"
          name="phoneNumber"
          autoComplete="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="service-type-label">Service Type</InputLabel>
          <Select
            labelId="service-type-label"
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            label="Service Type"
            onChange={handleChange}
          >
            <MenuItem value="Refund">Cancel & Refund</MenuItem>
            <MenuItem value="Technical Support">Technical Support</MenuItem>
            <MenuItem value="Account Management">Account Management</MenuItem>
            <MenuItem value="Billing Inquiry">Billing Inquiry</MenuItem>
            <MenuItem value="General Inquiry">General Inquiry</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          required
          fullWidth
          id="description"
          label="Description"
          name="description"
          multiline
          rows={4}
          value={formData.description}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit Request
        </Button>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Service request submitted successfully"
      />
      
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Previous Service Requests
      </Typography>
      <List>
        {previousRequests.map((request, index) => (
          <React.Fragment key={request._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={request.serviceType}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Typography>
                    {` — ${request.description}`}
                  </>
                }
              />
            </ListItem>
            {index < previousRequests.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default ServiceRequest;
