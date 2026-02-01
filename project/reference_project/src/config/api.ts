const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3048';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER_STUDENT: `${API_BASE_URL}/api/students/register`,
  REGISTER_COLLEGE: `${API_BASE_URL}/api/colleges`,
  REGISTER_ADMIN: `${API_BASE_URL}/api/admins/create`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // User endpoints
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  
  // Fest endpoints
  FESTS: `${API_BASE_URL}/api/public/fests`,
  MY_FESTS: (collegeId: number) => `${API_BASE_URL}/colleges/${collegeId}/fests`,
  CREATE_FEST: (collegeId: number) => `${API_BASE_URL}/colleges/${collegeId}/fests`,
  
  // Admin fest management
  PENDING_FESTS: `${API_BASE_URL}/admin/pending-fests`,
  APPROVE_FEST: (id: number) => `${API_BASE_URL}/admin/fests/${id}/approve`,
  REJECT_FEST: (id: number) => `${API_BASE_URL}/admin/fests/${id}/reject`,
  PUBLIC_FESTS: `${API_BASE_URL}/admin/public-fests`,
  
  // Booking endpoints
  BOOKINGS: `${API_BASE_URL}/bookings`,
  CREATE_BOOKING: `${API_BASE_URL}/bookings/create`,
  MY_BOOKINGS: `${API_BASE_URL}/bookings/my-bookings`,
  
  // Payment endpoints
  CREATE_PAYMENT: `${API_BASE_URL}/api/payments/create`,
  VERIFY_PAYMENT: `${API_BASE_URL}/api/payments/verify`,
  
  // Admin endpoints
  ALL_USERS: `${API_BASE_URL}/api/admin/users`,
  SYSTEM_STATS: `${API_BASE_URL}/api/admin/stats`,
  
  // Review endpoints
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  ADD_REVIEW: `${API_BASE_URL}/api/reviews/`,
};

export default API_BASE_URL;