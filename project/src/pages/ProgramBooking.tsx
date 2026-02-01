// IMPORTANT: Make sure to add this to your public/index.html:
// <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
// This ensures Razorpay is always available globally.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Tag, Users, ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface GroupMember {
  name: string;
  email: string;
  phone: string;
}

interface Program {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  bookingType?: 'solo' | 'group';
  seatLimit: number;
  ticketPrice: number;
  numberOfTeams?: number;
  maxGroupMembers?: number;
  fest: {
    title: string;
    college: {
      name: string;
    };
  };
}

function ProgramBooking() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([
    { name: '', email: '', phone: '' }
  ]);
  const [showGroupForm, setShowGroupForm] = useState(false);

  useEffect(() => {
    if (programId) {
      fetchProgramDetails(parseInt(programId));
    }
  }, [programId]);

  // Ensure Razorpay is loaded
  useEffect(() => {
    const loadRazorpay = () => {
      if (window.Razorpay) {
        console.log('Razorpay SDK loaded successfully');
        setRazorpayLoaded(true);
        return;
      }
      
      // If Razorpay is not loaded, try to load it
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay SDK loaded dynamically');
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        setRazorpayLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadRazorpay();
  }, []);

  // (No need to load Razorpay script here, it's loaded globally)

  const fetchProgramDetails = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3048/api/programs/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched program details:', data);
        console.log('Program bookingType:', data.bookingType);
        setProgram(data);
      } else {
        setProgram(null);
      }
    } catch (error) {
      console.error('Error fetching program details:', error);
      setProgram(null);
    } finally {
      setLoading(false);
    }
  };

  const addGroupMember = () => {
    if (program && groupMembers.length < (program.maxGroupMembers || 5)) {
      setGroupMembers([...groupMembers, { name: '', email: '', phone: '' }]);
    }
  };

  const removeGroupMember = (index: number) => {
    if (groupMembers.length > 1) {
      setGroupMembers(groupMembers.filter((_, i) => i !== index));
    }
  };

  const updateGroupMember = (index: number, field: keyof GroupMember, value: string) => {
    const updatedMembers = [...groupMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setGroupMembers(updatedMembers);
  };

  const validateGroupMembers = () => {
    for (let i = 0; i < groupMembers.length; i++) {
      const member = groupMembers[i];
      if (!member.name.trim() || !member.email.trim() || !member.phone.trim()) {
        alert(`Please fill all fields for team member ${i + 1}`);
        return false;
      }
      if (!member.email.includes('@')) {
        alert(`Please enter a valid email for team member ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleFreeBooking = async () => {
    if (!user || !programId) return;

    // For group bookings, validate team members
    if (program?.bookingType === 'group') {
      if (!validateGroupMembers()) {
        return;
      }
    }

    setBooking(true);
    try {
      const bookingData: any = {
        studentId: user.id.toString(),
        programId: programId,
      };

      // Add group booking data if it's a group event
      console.log('=== FRONTEND DEBUG ===');
      console.log('Program object:', program);
      console.log('Program bookingType:', program?.bookingType);
      console.log('Program bookingType type:', typeof program?.bookingType);
      console.log('Group members state:', groupMembers);
      console.log('Group members length:', groupMembers.length);
      
      if (program?.bookingType === 'group') {
        console.log('✅ This is a group booking!');
        bookingData.isGroupBooking = true;
        bookingData.groupSize = groupMembers.length;
        bookingData.totalAmount = program.ticketPrice;
        // Convert frontend format to backend format
        bookingData.groupMembers = groupMembers.map(member => ({
          memberName: member.name,
          memberEmail: member.email,
          memberPhone: member.phone
        }));
        console.log('✅ Sending group booking data:', bookingData);
        console.log('✅ Group members:', groupMembers);
      } else {
        console.log('❌ This is NOT a group booking. bookingType:', program?.bookingType);
        console.log('❌ Program bookingType comparison failed');
      }
      console.log('=== END FRONTEND DEBUG ===');

      const response = await fetch('http://localhost:3048/api/program-bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorText = await response.text();
        alert(errorText || 'Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handlePaidBooking = async () => {
    if (!user || !programId || !program) {
      alert('Missing user, programId, or program');
      console.error('user:', user, 'programId:', programId, 'program:', program);
      return;
    }

    // Wait for Razorpay to load
    let retries = 0;
    const maxRetries = 10;
    
    while (!window.Razorpay && retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500));
      retries++;
    }

    if (!window.Razorpay) {
      alert('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }
    if (!program.fest) {
      alert('Program data is missing fest information. Please contact support.');
      console.error('program.fest is missing:', program);
      return;
    }

    setBooking(true);
    try {
      // Step 1: Create Razorpay order
      alert('Creating Razorpay order...');
              const orderData: any = {
          programId: programId,
        };

        // Add group size for group bookings
        if (program?.bookingType === 'group') {
          orderData.groupSize = groupMembers.length;
        }

        const orderResponse = await fetch('http://localhost:3048/api/program-bookings/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

      console.log('Order response:', orderResponse);
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        alert('Failed to create order: ' + errorText);
        throw new Error('Failed to create order');
      }

      const { orderId } = await orderResponse.json();
      alert('Received orderId: ' + orderId);
      console.log('Received orderId:', orderId);

      // Step 2: Initialize Razorpay
      alert('Opening Razorpay popup...');
      const options = {
        key: 'rzp_test_St8Is9TfvDbJGe',
        amount: program.ticketPrice * 100,
        currency: 'INR',
        name: 'FestOrg',
        description: `${program.title} - ${(program.fest?.title || "Unknown Fest")}`,
        order_id: orderId,
        handler: async function (response: any) {
          alert('Payment Success! Razorpay response: ' + JSON.stringify(response));
          // Step 3: Create booking with payment details (send all Razorpay fields)
          try {
            const bookingData: any = {
              studentId: user.id.toString(),
              programId: programId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            // Add group booking data if it's a group event
            console.log('=== FRONTEND DEBUG (PAID) ===');
            console.log('Program object (paid):', program);
            console.log('Program bookingType (paid):', program?.bookingType);
            console.log('Program bookingType type (paid):', typeof program?.bookingType);
            console.log('Group members state (paid):', groupMembers);
            console.log('Group members length (paid):', groupMembers.length);
            
            if (program?.bookingType === 'group') {
              console.log('✅ This is a group booking (paid)!');
              bookingData.isGroupBooking = true;
              bookingData.groupSize = groupMembers.length;
              bookingData.totalAmount = program.ticketPrice;
              // Convert frontend format to backend format
              bookingData.groupMembers = groupMembers.map(member => ({
                memberName: member.name,
                memberEmail: member.email,
                memberPhone: member.phone
              }));
              console.log('✅ Sending group booking data (paid):', bookingData);
              console.log('✅ Group members (paid):', groupMembers);
            } else {
              console.log('❌ This is NOT a group booking (paid). bookingType:', program?.bookingType);
              console.log('❌ Program bookingType comparison failed (paid)');
            }
            console.log('=== END FRONTEND DEBUG (PAID) ===');

            const bookingResponse = await fetch('http://localhost:3048/api/program-bookings/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(bookingData),
            });

            if (bookingResponse.ok) {
              setSuccess(true);
            } else {
              const errorText = await bookingResponse.text();
              console.error('Booking failed:', errorText);
              alert(errorText || 'Booking failed');
            }
          } catch (error) {
            console.error('Error creating booking:', error);
            console.error('Booking error details:', error);
            alert('Booking failed');
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Payment initialization failed: ' + (error as any).message);
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
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

  // Placeholder program data (in reality, fetch from API)
  const placeholderProgram: Program = {
    id: parseInt(programId || '1'),
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React, Node.js, and MongoDB. This hands-on workshop will take you through building a full-stack application from scratch.',
    type: 'WORKSHOP',
    date: '2024-03-15',
    time: '10:00',
    venue: 'Computer Science Lab',
    seatLimit: 50,
    ticketPrice: 299,
    fest: {
      title: 'TechFest 2024',
      college: {
        name: 'ABC Institute of Technology'
      }
    }
  };

  const currentProgram = program || placeholderProgram;

  // Add debug log to render
  console.log('Rendering Pay & Register button', { booking, currentProgram, user });

  if (!user || user.role !== 'STUDENT') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only students can book programs</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              You have successfully registered for this program. Check your student dashboard for details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/student')}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Browse More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                {currentProgram.type}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currentProgram.ticketPrice === 0 ? 'Free' : `₹${currentProgram.ticketPrice}`}
                </div>
                <div className="text-white/80 text-sm">Registration Fee</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{currentProgram.title}</h1>
            <p className="text-white/90">
              {(currentProgram.fest?.title || "Unknown Fest") + " • " + (currentProgram.fest?.college?.name || "Unknown College")}
            </p>
          </div>

          <div className="p-6">
            {/* Program Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About This Program</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{currentProgram.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Date</div>
                      <div className="text-gray-600">{formatDate(currentProgram.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg mr-4">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Time</div>
                      <div className="text-gray-600">{currentProgram.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg mr-4">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Venue</div>
                      <div className="text-gray-600">{currentProgram.venue}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="bg-orange-100 p-3 rounded-lg mr-4">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {currentProgram.bookingType === 'group' ? 'Teams Available' : 'Seats Available'}
                      </div>
                      <div className="text-gray-600">
                        {currentProgram.bookingType === 'group' && currentProgram.numberOfTeams
                          ? `${currentProgram.numberOfTeams} teams (max ${currentProgram.maxGroupMembers || 0} members/team)`
                          : `${currentProgram.seatLimit} participants`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Booking Form */}
              {currentProgram.bookingType === 'group' && (
                <div className="lg:col-span-2 mb-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <Users className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-bold text-gray-900">Team Registration</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      This is a group event. Please add your team members below. 
                      Maximum {currentProgram.maxGroupMembers || 5} members per team.
                    </p>
                    
                    <div className="space-y-4">
                      {groupMembers.map((member, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Team Member {index + 1}</h4>
                            {index > 0 && (
                              <button
                                onClick={() => removeGroupMember(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) => updateGroupMember(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) => updateGroupMember(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="email@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <input
                                type="tel"
                                value={member.phone}
                                onChange={(e) => updateGroupMember(index, 'phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Phone number"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {groupMembers.length < (currentProgram.maxGroupMembers || 5) && (
                        <button
                          onClick={addGroupMember}
                          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                        >
                          + Add Team Member
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program</span>
                      <span className="font-medium">{currentProgram.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{formatDate(currentProgram.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{currentProgram.time}</span>
                    </div>
                    {currentProgram.bookingType === 'group' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span className="font-medium">{groupMembers.length} members</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        {currentProgram.ticketPrice === 0 
                          ? 'Free' 
                          : `₹${currentProgram.ticketPrice}`
                        }
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={currentProgram.ticketPrice === 0 ? handleFreeBooking : handlePaidBooking}
                    disabled={booking || (currentProgram.ticketPrice > 0 && !razorpayLoaded)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {booking ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : currentProgram.ticketPrice > 0 && !razorpayLoaded ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Loading Payment...
                      </div>
                    ) : (
                      <>
                        {currentProgram.ticketPrice === 0 ? (
                          <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                          <CreditCard className="h-5 w-5 mr-2" />
                        )}
                        {currentProgram.ticketPrice === 0 ? 'Register Now' : 'Pay & Register'}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    {currentProgram.ticketPrice === 0 
                      ? 'No payment required for this program'
                      : razorpayLoaded 
                        ? 'Secure payment powered by Razorpay'
                        : 'Loading payment gateway...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramBooking;