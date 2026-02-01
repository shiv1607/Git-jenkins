import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import ReactMarkdown from 'react-markdown';
import { Calendar, Users, IndianRupee, Info, Tag, Bookmark } from 'lucide-react';

const EventDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError("Event ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiService.getProgramById(parseInt(eventId, 10));
        setEvent(data);
        setError(null);
      } catch (err) {
        setError('Failed to load event details. The event may not exist or the server is unavailable.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg shadow-md">
          <Info className="w-8 h-8 mx-auto mb-2" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return <div className="text-center mt-20">Event not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                {event.category}
              </span>
              {event.program && (
                <span className="inline-block bg-gray-200 text-blue-700 px-3 py-1 rounded-full text-xs font-medium ml-2" title="This is the parent program for this event.">
                  Program: {event.program.name}
                </span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 my-4">{event.title}</h1>
            <div className="text-sm text-gray-500 mb-4">Each event belongs to a program. The program is the parent container for this event.</div>
            {/* Markdown description */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <ReactMarkdown>{event.description}</ReactMarkdown>
            </div>
            {event.tags && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {event.tags.split(',').map((tag: string) => (
                    <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                      <Tag size={14} /> {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg sticky top-8 p-6">
              <img
                src={event.imageUrl || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-6 shadow-md"
              />
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{event.seatLimit} Seats Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <IndianRupee className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="font-bold text-lg">{event.ticketPrice === 0 ? 'Free Event' : `₹${event.ticketPrice}`}</span>
                </div>
              </div>
              <button
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                onClick={() => navigate(`/book/${eventId}`)}
              >
                <Bookmark size={20} />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
