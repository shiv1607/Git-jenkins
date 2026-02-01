import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackendStatus from './components/BackendStatus';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CollegeDashboard from './pages/CollegeDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FestDetails from './pages/FestDetails';
import ProgramBooking from './pages/ProgramBooking';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <BackendStatus />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <Register />} />
          <Route path="/fest/:id" element={<FestDetails />} />
          <Route path="/book-program/:programId" element={<ProgramBooking />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin" 
            element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/college" 
            element={user?.role === 'COLLEGE' ? <CollegeDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/student" 
            element={user?.role === 'STUDENT' ? <StudentDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

function getDashboardRoute(role: string) {
  switch (role) {
    case 'ADMIN': return '/admin';
    case 'COLLEGE': return '/college';
    case 'STUDENT': return '/student';
    default: return '/';
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;