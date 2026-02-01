import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Star, Ticket, Users, Eye, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatBookingDate } from '../utils/dateUtils';

interface Booking {
  id: number;
  bookingDate: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  program: {
    id: number;
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    ticketPrice: number;
    fest: {
      title: string;
      college: {
        name: string;
      };
      approvalStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
    };
  };
  isGroupBooking: boolean;
}

function StudentDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      console.log(`Fetching bookings for student ${user?.id}`);
      const response = await fetch(`http://localhost:3048/api/program-bookings/student/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded bookings:', data);
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'hackathon': return 'bg-red-100 text-red-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'competition': return 'bg-green-100 text-green-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return bookings.filter(
      booking =>
        booking.program &&
        booking.program.date &&
        !isNaN(new Date(booking.program.date).getTime()) &&
        new Date(booking.program.date) >= now &&
        booking.paymentStatus === 'PAID'
    );
  };

  const getPastEvents = () => {
    const now = new Date();
    return bookings.filter(
      booking =>
        booking.program &&
        booking.program.date &&
        !isNaN(new Date(booking.program.date).getTime()) &&
        new Date(booking.program.date) < now &&
        booking.paymentStatus === 'PAID'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Dynamic calculations for dashboard statistics
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const totalSpent = bookings
    .filter(b => b.program && typeof b.program.ticketPrice === 'number')
    .reduce((sum, b) => sum + b.program.ticketPrice, 0);
  
  // Calculate average spending per booking
  const avgSpendingPerBooking = bookings.length > 0 ? (totalSpent / bookings.length).toFixed(0) : '0';
  
  // Calculate success rate (paid bookings vs total)
  const paidBookings = bookings.filter(b => b.paymentStatus === 'PAID').length;
  const successRate = bookings.length > 0 ? Math.round((paidBookings / bookings.length) * 100) : 0;
  
  // Calculate upcoming events count
  const upcomingEventsCount = upcomingEvents.length;
  
  // Calculate total events attended (past events)
  const totalEventsAttended = pastEvents.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Student Dashboard</h1>
          <p className="text-gray-500 text-lg font-medium">Welcome back! Here's your event summary.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Events Booked</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{bookings.length}</p>
                <p className="text-xs text-green-600 mt-1">+{upcomingEventsCount} upcoming</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">₹{totalSpent}</p>
                <p className="text-xs text-green-600 mt-1">₹{avgSpendingPerBooking} avg/booking</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{upcomingEventsCount}</p>
                <p className="text-xs text-green-600 mt-1">{upcomingEventsCount} upcoming</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Events Attended</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{totalEventsAttended}</p>
                <p className="text-xs text-green-600 mt-1">Past events</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 animate-gradient-x">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">College</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">No bookings yet.</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 transition-all duration-300 group">
                      <td className="px-4 py-2 font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">{booking.program?.title || 'N/A'}</td>
                      <td className="px-4 py-2 text-gray-700">{booking.program?.fest?.college?.name || 'Unknown College'}</td>
                      <td className="px-4 py-2 text-gray-700">{booking.program?.date ? formatDate(booking.program.date) : 'N/A'}</td>
                      <td className="px-4 py-2 text-gray-700">₹{typeof booking.program?.ticketPrice === 'number' ? booking.program.ticketPrice : 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.paymentStatus)}`}>{booking.paymentStatus === 'PAID' ? 'Confirmed' : booking.paymentStatus.charAt(0) + booking.paymentStatus.slice(1).toLowerCase()}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Recent Activity ({bookings.length} total bookings)
          </h2>
          <ul className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <li className="flex items-center space-x-3 py-3">
                <span className="bg-gray-100 text-gray-600 rounded-full p-2"><Calendar className="h-5 w-5" /></span>
                <div>
                  <div className="font-semibold text-gray-900">No bookings yet</div>
                  <div className="text-gray-500 text-sm">Start booking events to see your activity here</div>
                </div>
              </li>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <li key={booking.id} className="flex items-center space-x-3 py-3 hover:bg-gray-50 transition-colors">
                  <span className={`rounded-full p-2 ${
                    booking.paymentStatus === 'PAID' 
                      ? 'bg-green-100 text-green-600' 
                      : booking.paymentStatus === 'FAILED'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {booking.paymentStatus === 'PAID' ? (
                      <Users className="h-5 w-5" />
                    ) : booking.paymentStatus === 'FAILED' ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <Calendar className="h-5 w-5" />
                    )}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {booking.paymentStatus === 'PAID' ? 'Confirmed' : booking.paymentStatus === 'FAILED' ? 'Payment Failed' : 'Pending'} - {booking.program?.title || 'Unknown Event'}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {booking.program?.date ? formatDate(booking.program.date) : 'No date'} • ₹{booking.program?.ticketPrice || 0}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;