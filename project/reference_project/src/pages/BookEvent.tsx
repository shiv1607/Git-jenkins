import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';
import PaymentForm from '../components/Payment/PaymentForm';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, BadgeCheck } from 'lucide-react';

const BookEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  
  const [isAlreadyBooked, setIsAlreadyBooked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const checkStatusAndFetchEvent = async () => {
      if (!user || !eventId) {
        setError('User not logged in or event ID is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Check booking status first
        const statusResponse = await apiService.checkEventBookingStatus(user.id, parseInt(eventId, 10));
        setIsAlreadyBooked(statusResponse.isBooked);

        // Fetch event details to show on the page
        const eventData = await apiService.getEventById(parseInt(eventId, 10));
        setEvent(eventData);

      } catch (err) {
        setError('Could not verify booking status or fetch event details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndFetchEvent();
  }, [eventId, user]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-gray-600">Verifying your booking status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {isAlreadyBooked ? (
          <div className="text-center bg-green-100 text-green-800 p-8 rounded-lg shadow-lg">
            <BadgeCheck className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">You're Already In!</h2>
            <p className="text-lg">You have already booked a ticket for this event.</p>
            <p className="mt-4">You can view your bookings on your dashboard.</p>
          </div>
        ) : (
          event && <PaymentForm event={event} />
        )}
      </div>
    </div>
  );
};

export default BookEvent;