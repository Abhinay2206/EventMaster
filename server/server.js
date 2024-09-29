const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db')
const authorization = require('./routes/authRoute')
const eventsRoute = require('./routes/eventsRoute')
const userRoute = require('./routes/userRoute')
const ticketSalesRoute = require('./routes/ticketSalesRoute')
const profileRoute = require('./routes/profileRoute')
const reciptRoute = require('./routes/reciptRoute')
const serviceRequestRoute = require('./routes/serviceRequestRoute')

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());

connectDB()

// Routes
app.use('/api/auth', authorization);
app.use('/api/events', eventsRoute);
app.use('/api/users', userRoute);
app.use('/api/ticket-sales', ticketSalesRoute);
app.use('/api/user', profileRoute);
app.use('/api', reciptRoute);
app.use('/api', serviceRequestRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});