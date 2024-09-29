import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Drawer, List, ListItem, ListItemIcon, ListItemText, Container, Typography, Box, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import EventCreation from '../components/EventCreation';
import UserManagement from '../components/UserManagement';
import AttendeeCommunication from '../components/AttendeeCommunication';
import TicketSalesPage from './TicketSalesPage';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';

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
    backgroundColor: theme.palette.background.paper,
    borderRight: 'none',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  },
}));

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
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

const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('TicketSales');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedPage) {
      case 'EventCreation':
        return <EventCreation />;
      case 'UserManagement':
        return <UserManagement />;
      case 'TicketSales':
        return <TicketSalesPage />;
      case 'AttendeeCommunication':
        return <AttendeeCommunication />;
      default:
        return <TicketSalesPage />;
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, page: 'TicketSales' },
    { text: 'Create Event', icon: <EventIcon />, page: 'EventCreation' },
    { text: 'User Management', icon: <PeopleIcon />, page: 'UserManagement' },
    { text: 'Ticket Sales', icon: <ConfirmationNumberIcon />, page: 'TicketSales' },
    { text: 'Communication', icon: <ChatIcon />, page: 'AttendeeCommunication' },
  ];

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
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItemStyled
                button
                key={item.text}
                onClick={() => setSelectedPage(item.page)}
                selected={selectedPage === item.page}
                sx={{
                  backgroundColor: selectedPage === item.page ? theme.palette.action.selected : 'transparent',
                  color: selectedPage === item.page ? theme.palette.primary.main : theme.palette.text.primary,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemStyled>
            ))}
          </List>
        </Box>
      </DrawerStyled>
      <Content>
        <Toolbar />
        <Container maxWidth="lg">
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            p: 3, 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
            }
          }}>
            {renderContent()}
          </Box>
        </Container>
      </Content>
    </Root>
  );
};

export default AdminDashboard;
