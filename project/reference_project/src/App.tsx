import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Events from './pages/Events';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import BookEvent from './pages/BookEvent';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import EventDetails from './pages/EventDetails';
import CreateFest from './pages/CreateFest';
import CreateProgramForm from './components/Programs/CreateProgramForm';
import AddEventForm from './components/Events/AddEventForm';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-program" 
                  element={
                    <ProtectedRoute allowedRoles={['COLLEGE']}>
                      <CreateProgramForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/add-event" 
                  element={
                    <ProtectedRoute allowedRoles={['COLLEGE']}>
                      <AddEventForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/create-fest" 
                  element={
                    <ProtectedRoute allowedRoles={['COLLEGE']}>
                      <CreateFest />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/book/:eventId" 
                  element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                      <BookEvent />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/payment/success" 
                  element={
                    <ProtectedRoute>
                      <PaymentSuccess />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/events/:eventId" element={<EventDetails />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;