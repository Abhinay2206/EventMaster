import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 16px rgba(31, 38, 135, 0.2)',
  backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

const TicketSalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5007/api/getAllReceipts');
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(salesData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data");
    XLSX.writeFile(wb, "sales_data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Receipt ID', 'Event', 'Customer', 'Tickets', 'Total Price', 'Date']],
      body: salesData.map(sale => [
        sale.receiptId,
        sale.eventDetails.name,
        sale.userDetails.name,
        sale.selectedSeats.length,
        `₹${sale.totalPrice.toLocaleString()}`,
        sale.date
      ]),
    });
    doc.save('sales_data.pdf');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  const totalRevenue = salesData.reduce((sum, sale) => sum + sale.totalPrice, 0);
  const totalTickets = salesData.reduce((sum, sale) => sum + sale.selectedSeats.length, 0);

  const paymentMethodData = salesData.reduce((acc, sale) => {
    const method = sale.userDetails.paymentMethod;
    acc[method] = (acc[method] || 0) + sale.totalPrice;
    return acc;
  }, {});

  const pieChartData = Object.entries(paymentMethodData).map(([name, value]) => ({ name, value }));

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', my: 4, color: '#000' }}>
          Ticket Sales Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
                  Sales by Payment Method
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
                  Sales Summary
                </Typography>
                <Box display="flex" justifyContent="space-around" my={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                      {totalTickets}
                    </Typography>
                    <Typography variant="subtitle1">Total Tickets Sold</Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h4" sx={{ color: '#6366F1', fontWeight: 'bold' }}>
                    ₹{totalRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1">Total Revenue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>

        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <StyledCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ color: '#000' }}>
                    Recent Sales
                  </Typography>
                  <Box>
                    <Button onClick={exportToExcel} variant="outlined" sx={{ mr: 1 }}>
                      Export to Excel
                    </Button>
                    <Button onClick={exportToPDF} variant="outlined">
                      Export to PDF
                    </Button>
                  </Box>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{color: '#6366F1' , fontWeight: 'bold'}}>Receipt ID</TableCell>
                        <TableCell sx={{color: '#6366F1', fontWeight: 'bold'}}>Event</TableCell>
                        <TableCell sx={{color: '#6366F1', fontWeight: 'bold'}}>Customer</TableCell>
                        <TableCell align="right" sx={{color: '#6366F1', fontWeight: 'bold'}}>Tickets</TableCell>
                        <TableCell align="right" sx={{color: '#6366F1', fontWeight: 'bold'}}>Total Price</TableCell>
                        <TableCell align="right" sx={{color: '#6366F1', fontWeight: 'bold'}}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale._id}>
                          <TableCell>{sale.receiptId}</TableCell>
                          <TableCell>{sale.eventDetails.name}</TableCell>
                          <TableCell>{sale.userDetails.name}</TableCell>
                          <TableCell align="right">{sale.selectedSeats.length}</TableCell>
                          <TableCell align="right">₹{sale.totalPrice.toLocaleString()}</TableCell>
                          <TableCell align="right">{sale.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TicketSalesPage;
