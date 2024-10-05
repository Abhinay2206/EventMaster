/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Paper, Button, TextField, Box, Snackbar, Avatar,
  Grid, Divider, CircularProgress, Select, MenuItem, FormControl, InputLabel,
  Chip, Fade, Zoom, IconButton, Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: 'linear-gradient(90deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.4)',
    },
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(20),
  height: theme.spacing(20),
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '4px solid white',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '12px 24px',
  fontWeight: 600,
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'all 0.3s',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
    transform: 'translateY(-2px)',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 500,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
}));

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5007/api/user/getDetails/${email}`);
      setUserDetails(response.data);
      setEditedDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedDetails({ ...editedDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5007/api/user/updateDetails/${email}`, editedDetails);
      setUserDetails(response.data);
      setIsEditing(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails(userDetails);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom sx={{ my: 4, fontWeight: 700, color: '#333', textAlign: 'center' }}>
          Profile
        </Typography>
        <StyledPaper elevation={3}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ProfileAvatar src={userDetails.avatarUrl || '/default-avatar.png'} alt={userDetails.name} />
            </motion.div>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
              {userDetails.name}
            </Typography>
            <StyledChip label={userDetails.role || 'User'} color="primary" />
          </Box>
          <Divider sx={{ my: 3 }} />
          <AnimatePresence>
            {isEditing ? (
              <Fade in={isEditing}>
                <Box component="form" noValidate>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={editedDetails.name || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Mobile Number"
                        name="mobileNumber"
                        value={editedDetails.mobileNumber || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        value={editedDetails.age || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="sex-label">Sex</InputLabel>
                        <Select
                          labelId="sex-label"
                          name="sex"
                          value={editedDetails.sex || ''}
                          onChange={handleChange}
                          label="Sex"
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <StyledTextField
                        fullWidth
                        label="Address"
                        name="address"
                        multiline
                        rows={3}
                        value={editedDetails.address || ''}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Box mt={3} display="flex" justifyContent="flex-end">
                    <Tooltip title="Cancel">
                      <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
                        <CancelIcon />
                      </IconButton>
                    </Tooltip>
                    <StyledButton
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                      startIcon={<SaveIcon />}
                    >
                      Save Changes
                    </StyledButton>
                  </Box>
                </Box>
              </Fade>
            ) : (
              <Zoom in={!isEditing}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{userDetails.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">Mobile Number</Typography>
                    <Typography variant="body1">{userDetails.mobileNumber || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">Age</Typography>
                    <Typography variant="body1">{userDetails.age || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" color="textSecondary">Sex</Typography>
                    <Typography variant="body1">{userDetails.sex || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="textSecondary">Address</Typography>
                    <Typography variant="body1">{userDetails.address || 'Not provided'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mt={3} display="flex" justifyContent="flex-end">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <StyledButton
                          variant="contained"
                          color="primary"
                          onClick={handleEdit}
                          startIcon={<EditIcon />}
                        >
                          Edit Profile
                        </StyledButton>
                      </motion.div>
                    </Box>
                  </Grid>
                </Grid>
              </Zoom>
            )}
          </AnimatePresence>
        </StyledPaper>
      </motion.div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Profile updated successfully"
      />
    </Container>
  );
};

export default ProfilePage;
