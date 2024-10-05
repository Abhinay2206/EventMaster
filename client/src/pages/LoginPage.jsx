import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Link,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import axios from 'axios';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';

const LoginPage = () => {
  const [loginType, setLoginType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  // eslint-disable-next-line no-unused-vars
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5007/api/auth/login', {
        email,
        password,
        role: loginType,
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('jwtToken', response.data.token);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('userRole', loginType);
      if (loginType === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/client-dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleGithubLogin = () => {
    console.log('GitHub login clicked');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          borderRadius: '16px',
          background: theme.palette.background.paper,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: theme.palette.primary.main }}>
          Welcome Back
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel id="login-type-label">Login Type</InputLabel>
            <Select
              labelId="login-type-label"
              value={loginType}
              label="Login Type"
              onChange={(e) => setLoginType(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              }
            }}
            disabled={!loginType}
          >
            Sign In
          </Button>
          <Divider sx={{ my: 2 }}>Or</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={handleGithubLogin}
            sx={{ 
              mb: 2, 
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Sign in with GitHub
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ 
              mb: 2, 
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              textTransform: 'none',
            }}
          >
            Sign in with Google
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Don&apos;t have an account?{' '}
              <Link 
                component="button" 
                variant="body2" 
                onClick={handleCreateAccount}
                sx={{ 
                  fontWeight: 'bold',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Create new
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
