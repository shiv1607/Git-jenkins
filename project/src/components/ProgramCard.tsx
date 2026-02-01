import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, BookOpen } from 'lucide-react';
import GroupBooking from './GroupBooking';

interface ProgramCardProps {
  program: {
    id: number;
    title: string;
    description: string;
    type: string;
    date: string;
    time: string;
    venue: string;
    seatLimit: number;
    ticketPrice: number;
    fest: {
      title: string;
      college: {
        name: string;
      };
    };
  };
  onBookingComplete: (booking: any) => void;
}

export default function ProgramCard({ program, onBookingComplete }: ProgramCardProps) {
  const [showGroupBooking, setShowGroupBooking] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBookNow = () => {
    setShowGroupBooking(true);
  };

  const handleBookingComplete = (booking: any) => {
    onBookingComplete(booking);
    setShowGroupBooking(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">{program.title}</h3>
              <p className="text-blue-100">{program.fest.title}</p>
              <p className="text-blue-100 text-sm">{program.fest.college.name}</p>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                {program.type}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-600 mb-6 line-clamp-3">{program.description}</p>

          {/* Program Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDate(program.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-medium">{program.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-medium">{program.venue}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="font-medium">{program.seatLimit}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Price per person</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                ₹{program.ticketPrice}
              </span>
            </div>
            {program.ticketPrice === 0 && (
              <p className="text-green-600 text-sm mt-1">Free Program</p>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleBookNow}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <BookOpen className="w-5 h-5" />
            {loading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </div>

      {/* Group Booking Modal */}
      {showGroupBooking && (
        <GroupBooking
          programId={program.id}
          programTitle={program.title}
          ticketPrice={program.ticketPrice}
          onBookingComplete={handleBookingComplete}
          onClose={() => setShowGroupBooking(false)}
        />
      )}
    </>
  );
} 