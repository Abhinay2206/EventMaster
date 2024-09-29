import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Box, Card, CardContent, IconButton, Fade, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled } from '@mui/system';
import EventIcon from '@mui/icons-material/Event';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Events from '../assets/events.svg'

const StyledAppBar = styled(AppBar)({
  background: 'transparent',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
});

const HeroSection = styled(Box)({
  minHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#333',
  textAlign: 'left',
  position: 'relative',
});

const HeroContent = styled(Box)({
  zIndex: 1,
  position: 'relative',
  maxWidth: '1200px',
  width: '100%',
  padding: '0 20px',
});

const FeatureCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
});

const TestimonialCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
  },
});

const Footer = styled(Box)({
  padding: '40px 0',
  background: '#f5f5f5',
  color: '#333',
  textAlign: 'center',
});

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignUpClick = () => {
    navigate('/login');
  };

  return (
    <Box>
      <StyledAppBar position="fixed" color={isScrolled ? 'default' : 'transparent'} elevation={isScrolled ? 4 : 0}>
        <Container>
          <Toolbar disableGutters>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#333', textAlign: 'left', fontSize: '1.5rem' }}>
              EventMaster
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                variant="outlined" 
                onClick={handleSignUpClick} 
                sx={{ 
                  borderColor: '#1a237e', 
                  color: '#1a237e',
                  '&:hover': {
                    backgroundColor: '#1a237e',
                    borderColor: '#fff',
                    color: '#fff',
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#333' }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
          transition: 'all 0.3s ease-in-out',
          zIndex: 1099,
        }}
      />

      <HeroSection alignItems="center" sx={{ mt: -1, ml: { xs: 0, md: 4 } }}>
        <HeroContent>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in={true} timeout={1000}>
                <Typography variant="h1" sx={{ fontWeight: '350', mb: 1, mr: 22, fontSize: { xs: '2.5rem', md: '4.5rem' }, color: '#1a237e' }}>
                  Elevate Your Events with EventMaster
                </Typography>
              </Fade>
              <Fade in={true} timeout={1500}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 300, color: '#333' }}>
                  Seamless planning, unforgettable experiences. From concept to execution, we&apos;ve got you covered.
                </Typography>
              </Fade>
              <Fade in={true} timeout={2000}>
                <Button 
                  variant="contained" 
                  onClick={handleSignUpClick}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 1,
                    backgroundColor: '#1a237e',
                    color: 'white',
                    padding: '10px 25px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#3f51b5',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Start Planning Now
                </Button>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5}>
              <Fade in={true} timeout={2500}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={Events}
                    alt="Event planning hero image"
                    style={{
                      width: '100%',
                      height: '100%',
                      maxWidth: '350px',
                      maxHeight: '350px',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </HeroContent>
      </HeroSection>

      <Container sx={{ py: 8, mt: -4 }} id="features">
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold', color: '#1a237e' }}>
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <EventIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Intuitive Event Creation
                </Typography>
                <Typography variant="body2">
                  Design and manage events with our user-friendly interface, streamlining your planning process.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <ConfirmationNumberIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Secure Ticketing
                </Typography>
                <Typography variant="body2">
                  Offer peace of mind with our robust, secure ticket sales and integrated payment solutions.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <NotificationsActiveIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Instant Updates
                </Typography>
                <Typography variant="body2">
                  Keep attendees in the loop with real-time notifications and event updates.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold', color: '#1a237e' }}>
          What Our Clients Say
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <TestimonialCard>
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormatQuoteIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  &quot;EventMaster transformed our company retreat into an unforgettable experience. Their attention to detail and seamless execution were impressive!&quot;
                </Typography>
              </CardContent>
            </TestimonialCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <TestimonialCard>
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormatQuoteIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  &quot;The ticketing system is top-notch. We saw a significant increase in attendance and smoother check-ins at our annual conference.&quot;
                </Typography>
              </CardContent>
            </TestimonialCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <TestimonialCard>
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FormatQuoteIcon sx={{ fontSize: 50, color: '#1a237e', mb: 2 }} />
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', fontStyle: 'italic' }}>
                  &quot;EventMasters platform is intuitive and powerful. Its made managing our multi-day festival a breeze. Highly recommended!&quot;
                </Typography>
              </CardContent>
            </TestimonialCard>
          </Grid>
        </Grid>
      </Container>

      <Container sx={{ py: 8, backgroundColor: '#fff', borderRadius: '20px' }}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold', color: '#1a237e', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
          <Accordion sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px !important' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#1a237e' }} />}
              sx={{ 
                backgroundColor: '#e8eaf6',
                '&:hover': { backgroundColor: '#c5cae9' },
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>How do I create an event?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
              <Typography sx={{ color: '#333' }}>
                Creating an event is simple! Just sign up for an account, click on &quot;Create Event&quot; in your dashboard, and follow the step-by-step guide. You&apos;ll be able to add all the details, set up ticketing, and publish your event in no time.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px !important' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#1a237e' }} />}
              sx={{ 
                backgroundColor: '#e8eaf6',
                '&:hover': { backgroundColor: '#c5cae9' },
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>What types of events can I manage with EventMaster?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
              <Typography sx={{ color: '#333' }}>
                EventMaster is versatile and can handle a wide range of events, from small meetups to large conferences, music festivals, workshops, and corporate events. Our platform is designed to be flexible to meet various event management needs.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px !important' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#1a237e' }} />}
              sx={{ 
                backgroundColor: '#e8eaf6',
                '&:hover': { backgroundColor: '#c5cae9' },
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>How secure is the ticketing system?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
              <Typography sx={{ color: '#333' }}>
                Security is our top priority. We use industry-standard encryption for all transactions, and our ticketing system is regularly audited for vulnerabilities. We also offer features like unique QR codes for each ticket to prevent fraud.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '10px !important' }}>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: '#1a237e' }} />}
              sx={{ 
                backgroundColor: '#e8eaf6',
                '&:hover': { backgroundColor: '#c5cae9' },
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>Can I customize the look of my event page?</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
              <Typography sx={{ color: '#333' }}>
                Absolutely! EventMaster offers a range of customization options. You can add your own branding, choose color schemes, and even use custom CSS if you want more advanced styling. We believe your event page should reflect your unique brand.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>

      <Footer>
        <Container>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1a237e' }}>Connect With Us</Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#333' }}>info@eventmaster.com</Typography>
          <Box sx={{ mb: 2 }}>
            <IconButton color="primary" aria-label="Facebook" sx={{ mx: 1, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>
              <FacebookIcon />
            </IconButton>
            <IconButton color="primary" aria-label="Twitter" sx={{ mx: 1, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>
              <TwitterIcon />
            </IconButton>
            <IconButton color="primary" aria-label="Instagram" sx={{ mx: 1, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.2)' } }}>
              <InstagramIcon />
            </IconButton>
          </Box>
          <Typography variant="caption" sx={{ color: '#666' }}>© 2024 EventMaster. All rights reserved.</Typography>
        </Container>
      </Footer>
    </Box>
  );
};

export default LandingPage;
