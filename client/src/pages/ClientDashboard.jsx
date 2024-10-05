/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Typography, IconButton, Box, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import EventIcon from '@mui/icons-material/Event';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SupportIcon from '@mui/icons-material/Support';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventList from '../components/EventList';
import ProfilePage from './ProfilePage';
import OrdersPage from '../components/ordersPage';
import ServiceRequest from './ServiceRequest';

const drawerWidth = 240;

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(8px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DrawerStyled = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    borderRight: 'none',
    boxShadow: '4px 0 10px rgba(0, 0, 0, 0.05)',
  },
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  paddingTop: -10 ,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(5px)',
  },
}));

export default function ClientDashboard() {
  const [selectedPage, setSelectedPage] = useState('Events');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedPage) {
      case 'Events':
        return <EventList />;
      case 'My Orders':
        return <OrdersPage />;
      case 'Service Request':
        return <ServiceRequest />;
      case 'Profile':
        return <ProfilePage />;
      default:
        return <Typography>Events Content</Typography>;
    }
  };

  return (
    <Root>
      <AppBarStyled position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontWeight: 'bold', color: theme.palette.text.primary, marginRight: 'auto' }}>
            Event Master
          </Typography>
          <IconButton color="inherit" onClick={handleLogout} sx={{ 
            '&:hover': { 
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              transform: 'rotate(180deg)',
              transition: 'transform 0.3s'
            } 
          }}>
            <LogoutIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent">
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <List>
            {[
              { text: 'Events', icon: <EventIcon /> },
              { text: 'My Orders', icon: <ShoppingCartIcon /> },
              { text: 'Service Request', icon: <SupportIcon /> },
              { text: 'Profile', icon: <AccountCircleIcon /> },
            ].map((item) => (
              <ListItemStyled
                button
                key={item.text}
                onClick={() => setSelectedPage(item.text)}
                selected={selectedPage === item.text}
                sx={{
                  backgroundColor: selectedPage === item.text ? 'action.selected' : 'transparent',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: selectedPage === item.text ? theme.palette.primary.main : theme.palette.text.primary }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemStyled>
            ))}
          </List>
        </Box>
      </DrawerStyled>
      <Content>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 2 }}> {/* Added margin top */}
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 4, 
            p: 3, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 6px 30px rgba(0,0,0,0.15)',
            }
          }}>
            {renderContent()}
          </Box>
        </Container>
      </Content>
    </Root>
  );
}