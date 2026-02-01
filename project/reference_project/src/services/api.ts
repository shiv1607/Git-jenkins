import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3048',
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('Backend server is not available');
      return Promise.reject(new Error('Backend server is not running. Please start the Spring Boot application.'));
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth services
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    // Extract fields as returned by the backend
    const { userId, username, role, message } = response.data;
    const user = { id: userId, username, role };
    const token = ""; // No token provided by backend; update if you add JWT support
    return { user, token };
    // If you want to return a user object from the backend, change the backend response to:
    // { user: { id, username, role }, token: "..." }
  },

  register: async (userData: any) => {
    let endpoint = '';
    let payload = { ...userData };

    switch (userData.role) {
      case 'STUDENT':
        endpoint = '/api/students/register';
        payload = {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'STUDENT',
          collegeName: userData.collegeName || '',
          course: userData.course || '',
          year: userData.year || 1
        };
        break;
      case 'COLLEGE':
        endpoint = '/api/colleges';
        payload = {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'COLLEGE',
          name: userData.collegeName,
          address: userData.address || '',
          contactNumber: userData.contactNumber || ''
        };
        break;
      case 'ADMIN':
        endpoint = '/api/admins/create';
        payload = {
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: 'ADMIN',
          fullName: userData.fullName || userData.username,
          contactNumber: userData.contactNumber || ''
        };
        break;
      default:
        throw new Error('Invalid role specified');
    }

    const response = await api.post(endpoint, payload);
    
    const user = response.data;
    const token = `token_${user.id}_${Date.now()}`; 
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    };
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/api/auth/reset-password', { token, newPassword });
    return response.data;
  },

  logout: async () => {
    return { message: 'Logged out successfully' };
  },

  // Fest services
  getFests: async () => {
    const response = await api.get('/api/public/fests');
    return response.data;
  },

  getMyFests: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User data from localStorage:', user);
    console.log('User ID:', user.id);
    console.log('User role:', user.role);
    
    if (user.role === 'COLLEGE') {
      // Fix: Added the /api prefix to the URL
      const url = `/api/colleges/${user.id}/fests`;
      console.log('Making request to:', url);
      const response = await api.get(url);
      return response.data;
    }
    return [];
  },

  createFest: async (festData: any) => {
    try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || user.role !== 'COLLEGE') {
        throw new Error("Unauthorized");
      }
      // Use the new, unique endpoint for creating fests
      const response = await api.post(`/api/college-fests/${user.id}`, festData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating fest:', error);
      throw error;
    }
  },

  getFestById: async (id: number) => {
    // CORRECT ENDPOINT: /api/public/fests/{id}
    const response = await api.get(`/api/public/fests/${id}`);
    return response.data;
  },

  getPendingFests: async () => {
    const response = await api.get('/admin/pending-fests');
    return response.data;
  },

  approveFest: async (id: number) => {
    const response = await api.put(`/admin/fests/${id}/approve`);
    return response.data;
  },

  rejectFest: async (id: number) => {
    const response = await api.put(`/admin/fests/${id}/reject`);
    return response.data;
  },

  getApprovedPublicFests: async () => {
    const response = await api.get('/admin/public-fests');
    return response.data;
  },

  // Booking services
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  createBooking: async (festId: number, razorpayPaymentId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const payload = {
      studentId: user.id,
      festId: festId,
      razorpayPaymentId: razorpayPaymentId
    };
    const response = await api.post('/bookings/create', payload);
    return response.data;
  },

  checkBookingStatus: async (studentId: number, festId: number) => {
    try {
      const response = await api.get('/bookings/check', {
        params: { studentId, festId }
      });
      return response.data; // Should return { isBooked: boolean }
    } catch (error) {
      console.error('Error checking booking status:', error);
      throw error;
    }
  },

  // Payment services
  createPayment: async (festId: number) => {
    const response = await api.post('/bookings/create-order', { festId });
    return response.data;
  },

  verifyPayment: async (paymentData: any) => {
    return { success: true, payment: paymentData };
  },

  // Review services
  addReview: async (reviewData: any) => {
    const response = await api.post('/api/reviews/', reviewData);
    return response.data;
  },

  getReviewsByFest: async (festId: number) => {
    const response = await api.get(`/api/reviews/fest/${festId}`);
    return response.data;
  },

  // College services
  deleteFest: async (festId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'COLLEGE') {
      const response = await api.delete(`/api/colleges/${user.id}/fests/${festId}`);
      return response.data;
    }
    throw new Error('Only colleges can delete fests');
  },

  getBookingsByStudentId: async (studentId: number) => {
    const response = await api.get(`/api/program-bookings/student/${studentId}`);
    return response.data;
  },

  getProgramById: async (id: number) => {
    const response = await api.get(`/api/programs/${id}`);
    return response.data;
  },

  checkProgramBookingStatus: async (studentId: number, programId: number) => {
    const response = await api.get(`/api/program-bookings/student/${studentId}`);
    const bookings = response.data || [];
    const isBooked = bookings.some((booking: any) => booking.program && booking.program.id === programId);
    return { isBooked };
  },

  getProgramsByFestId: async (festId: number) => {
    const response = await api.get(`/api/programs/fest/${festId}`);
    return response.data;
  },

  createProgram: async (festId: number, programData: any) => {
    const response = await api.post(`/api/programs/create/${festId}`, programData);
    return response.data;
  },

  getMyPrograms: async () => {
    // Fetch all programs (fests) created by the logged-in college user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'COLLEGE') {
      const response = await api.get(`/api/colleges/${user.id}/fests`);
      return response.data;
    }
    return [];
  },

  createEventUnderProgram: async (programId: number, eventData: any) => {
    // Create an event (program) under a program (fest)
    const response = await api.post(`/api/programs/create/${programId}`, eventData);
    return response.data;
  },

  createProgramContainer: async (programData: any) => {
    // Create a new program (container, i.e., fest) for the logged-in college user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || user.role !== 'COLLEGE') {
      throw new Error('Unauthorized');
    }
    const response = await api.post(`/api/college-fests/${user.id}`, programData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  checkEventBookingStatus: async (studentId: number, eventId: number) => {
    // Same as checkProgramBookingStatus but for events (frontend, backend Program)
    const response = await api.get(`/api/program-bookings/student/${studentId}`);
    const bookings = response.data || [];
    const isBooked = bookings.some((booking: any) => booking.program && booking.program.id === eventId);
    return { isBooked };
  },

  getEventById: async (id: number) => {
    // Same as getProgramById but for events (frontend, backend Program)
    const response = await api.get(`/api/programs/${id}`);
    return response.data;
  },

  deleteProgram: async (programId: number) => {
    // Same as deleteFest but for programs (frontend, backend Fest)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'COLLEGE') {
      const response = await api.delete(`/api/colleges/${user.id}/fests/${programId}`);
      return response.data;
    }
    throw new Error('Only colleges can delete programs');
  },

  createEvent: async (programId: number, eventData: any) => {
    // Create a new event (frontend Event, backend Program) under a program (frontend Program, backend Fest)
    const response = await api.post(`/api/programs/create/${programId}`, eventData);
    return response.data;
  }
};

export default apiService;