import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, Avatar, Box, MenuItem, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const email = localStorage.getItem('email');
        console.log('Token:', token);
        console.log('Email:', email);
        if (!token || !email) {
          throw new Error('No token or email found');
        }
        const response = await axios.get(`http://localhost:5007/api/user/getDetails/${email}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // eslint-disable-next-line no-unused-vars
        const { _id, createdAt, __v, ...userData } = response.data;
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const email = localStorage.getItem('email');
      const updatedUser = { ...user, ...editedUser };
      const response = await axios.put(`http://localhost:5007/api/user/updateDetails/${email}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // eslint-disable-next-line no-unused-vars
      const { _id, createdAt, __v, ...userData } = response.data;
      setUser(userData);
      setEditedUser({});
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="sm">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container component="main" maxWidth="sm">
        <Typography color="error">Failed to load user data. Please try again later.</Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <StyledPaper elevation={3}>
        <StyledAvatar src="/path-to-avatar-image.jpg" alt={user.name} />
        <Typography component="h1" variant="h5" gutterBottom>
          User Profile
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {Object.entries(user).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                {isEditing ? (
                  key === 'sex' ? (
                    <TextField
                      select
                      fullWidth
                      label="Sex"
                      name="sex"
                      value={editedUser.sex || user.sex || ''}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={editedUser[key] !== undefined ? editedUser[key] : value || ''}
                      onChange={handleInputChange}
                      disabled={key === 'email'}
                    />
                  )
                ) : (
                  <Typography>
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || 'Not provided'}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            {isEditing ? (
              <>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default ProfilePage;
