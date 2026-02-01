import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, User, CreditCard } from 'lucide-react';

interface GroupMember {
  id: number;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
}

interface BookingCardProps {
  booking: {
    id: number;
    programName: string;
    festivalName: string;
    collegeName: string;
    programDate: string;
    programTime: string;
    programVenue: string;
    ticketPrice: number;
    totalAmount: number;
    isGroupBooking: boolean;
    groupSize: number;
    paymentStatus: string;
    bookingDate: string;
    groupMembers?: GroupMember[];
  };
}

export default function BookingCard({ booking }: BookingCardProps) {
  const [showGroupMembers, setShowGroupMembers] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold mb-1">{booking.programName}</h3>
            <p className="text-blue-100">{booking.festivalName}</p>
            <p className="text-blue-100 text-sm">{booking.collegeName}</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
              {booking.isGroupBooking ? (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Group ({booking.groupSize})</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Individual</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{formatDate(booking.programDate)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium">{booking.programTime}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Venue</p>
              <p className="font-medium">{booking.programVenue}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.paymentStatus === 'PAID' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Price per person</p>
              <p className="font-medium">₹{booking.ticketPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-blue-600">₹{booking.totalAmount}</p>
            </div>
          </div>
          {booking.isGroupBooking && (
            <p className="text-sm text-gray-600 mt-2">
              {booking.groupSize} × ₹{booking.ticketPrice} per person
            </p>
          )}
        </div>

        {/* Group Members */}
        {booking.isGroupBooking && booking.groupMembers && booking.groupMembers.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setShowGroupMembers(!showGroupMembers)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Users className="w-4 h-4" />
              {showGroupMembers ? 'Hide' : 'Show'} Group Members ({booking.groupMembers.length})
            </button>
            
            {showGroupMembers && (
              <div className="mt-4 space-y-3">
                {booking.groupMembers.map((member, index) => (
                  <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <h4 className="font-medium">{member.memberName}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {member.memberEmail && (
                        <div>
                          <span className="font-medium">Email:</span> {member.memberEmail}
                        </div>
                      )}
                      {member.memberPhone && (
                        <div>
                          <span className="font-medium">Phone:</span> {member.memberPhone}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Booking Date */}
        <div className="text-sm text-gray-500">
          Booked on: {formatDateTime(booking.bookingDate)}
        </div>
      </div>
    </div>
  );
} 