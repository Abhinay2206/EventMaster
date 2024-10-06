import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import AdminDashboard from './pages/AdminDashboard'
import ClientDashboard from './pages/ClientDashboard'
import EventList from './components/EventList'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './components/ordersPage'
import ServiceRequest from './pages/ServiceRequest'
import EventCreation from './components/EventCreation'
import UserManagement from './components/UserManagement'
import TicketSales from './pages/TicketSalesPage'
import Communication from './components/AttendeeCommunication'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TicketSales />} />
          <Route path="create-event" element={<EventCreation />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="ticket-sales" element={<TicketSales />} />
          <Route path="communication" element={<Communication />} />
        </Route>

        <Route path="/client-dashboard" element={<ClientDashboard />}>
          <Route index element={<Navigate to="events" replace />} />
          <Route path="events" element={<EventList />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="service-request" element={<ServiceRequest />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App
