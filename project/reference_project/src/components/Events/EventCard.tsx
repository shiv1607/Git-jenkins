import React from 'react';
import { Calendar, MapPin, Users, IndianRupee, Star, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    seatLimit: number;
    ticketPrice: number;
    imageUrl: string;
    category?: string;
    subCategory?: string;
    tags?: string;
    program: {
      id: number;
      name: string;
    };
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = new Date(event.date) > new Date();
  const defaultImageUrl = 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col justify-between h-full">
      <div className="relative overflow-hidden rounded-t-xl">
        <Link to={`/events/${event.id}`}>
        <img
            src={event.imageUrl || defaultImageUrl}
          alt={event.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        </Link>
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg text-sm">
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-4 w-4" />
              <span className="font-bold">{event.ticketPrice}</span>
            </div>
          </div>
        </div>
        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isUpcoming 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {isUpcoming ? 'Upcoming' : 'Past Event'}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-blue-700 shadow flex items-center gap-1" title="This is the parent program for this event.">
          <Info className="h-3 w-3 mr-1 inline-block" />
          Program: {event.program?.name}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
          <Link to={`/events/${event.id}`} className="hover:underline">
          {event.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
          {event.description}
        </p>
        <div className="space-y-2 mb-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <span>{event.seatLimit} seats</span>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Link to={`/events/${event.id}`} className="block">
          <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
          >
              View Details
          </button>
          </Link>
          </div>
      </div>
    </div>
  );
};

export default EventCard;