/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Snackbar, List, ListItem, ListItemText, Divider, Paper, Grid, Chip, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { motion } from 'framer-motion';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '12px 24px',
  fontWeight: 600,
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
}));

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

  const fetchPreviousRequests = async () => {
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.error('User email not found');
        return;
      }
      console.log(userEmail);
      const response = await axios.get(`http://localhost:5007/api/getAll-service-requests/${userEmail}`);
      setPreviousRequests(response.data);
    } catch (error) {
      console.error('Error fetching previous service requests:', error);
    }
  };

  useEffect(() => {
    fetchPreviousRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem('email');
      if (!userEmail) {
        console.error('User email not found');
        return;
      }
      const requestData = { ...formData, email: userEmail };
      await axios.post('http://localhost:5007/api/service-requests', requestData);
      setOpenSnackbar(true);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        serviceType: '',
        description: '',
      });
      fetchPreviousRequests();
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4, fontWeight: 700, color: '#333' }}>
        Service Request
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StyledPaper elevation={3}>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <StyledTextField
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
                <StyledTextField
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
                <StyledTextField
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
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  endIcon={<SendIcon />}
                >
                  Submit Request
                </StyledButton>
              </Box>
            </StyledPaper>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledPaper elevation={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
                  Previous Service Requests
                </Typography>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchPreviousRequests} color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <List>
                {previousRequests.map((request, index) => (
                  <React.Fragment key={request._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {request.serviceType}
                            </Typography>
                            <StyledChip
                              label={new Date(request.createdAt).toLocaleDateString()}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'inline', mt: 1 }}
                          >
                            {request.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < previousRequests.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </StyledPaper>
          </motion.div>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Service request submitted successfully"
      />
    </Container>
  );
};

export default ServiceRequest;
