import React,{ useState, useEffect } from 'react';
import { Grid, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import axios from 'axios';

const AttendeeCommunication = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (email) {
        try {
          const response = await axios.get('http://localhost:5007/api/getAll-service-requests');
          setServiceRequests(response.data);
        } catch (error) {
          console.error('Error fetching service requests:', error);
        }
      }
    };

    fetchServiceRequests();
  }, [email]);

  return (
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>Service Requests</Typography>
      <List>
        {serviceRequests.map((request, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color="primary">
                    {request.serviceType}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      Name: {request.name}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textPrimary">
                      Email: {request.email}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textPrimary">
                      Phone: {request.phoneNumber}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      Description: {request.description}
                    </Typography>
                    <br />
                    <Typography component="span" variant="caption" color="textSecondary">
                      Submitted: {new Date(request.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {index < serviceRequests.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Grid>
  );
};

export default AttendeeCommunication;
