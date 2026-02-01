import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Star, ArrowRight, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  reviews: Review[];
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  student: {
    username: string;
  };
}

interface Fest {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  college: {
    name: string;
  };
  programs: Program[];
  imageUrl?: string;
}

function FestDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [fest, setFest] = useState<Fest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFestDetails(parseInt(id));
    }
  }, [id]);

  const fetchFestDetails = async (festId: number) => {
    try {
      const response = await fetch(`http://localhost:3048/api/public/fests/${festId}`);
      if (response.ok) {
        const data = await response.json();
        setFest(data);
      }
    } catch (error) {
      console.error('Error fetching fest details:', error);
    } finally {
      setLoading(false);
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

  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!fest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Festival not found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            {fest.imageUrl ? (
              <img 
                src={fest.imageUrl} 
                alt={fest.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-24 w-24 text-white opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{fest.title}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {fest.college?.name || "Unknown College"}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                                      {formatDate(fest.startDate)} - {formatDate(fest.endDate)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">{fest.description}</p>
            <div className="mt-4 flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-600">{Array.isArray(fest.programs) ? fest.programs.length : 0} Programs Available</span>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>
          
          {Array.isArray(fest.programs) && fest.programs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Programs Yet</h3>
              <p className="text-gray-600">Check back later for program announcements!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(fest.programs) && fest.programs.length > 0 && (
                fest.programs.map((program) => (
                  <div key={program.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(program.type)}`}>
                          {program.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          program.bookingType === 'group' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {program.bookingType === 'group' ? 'Group Event' : 'Solo Event'}
                        </span>
                      </div>
                      {program.reviews.length > 0 && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">
                            {getAverageRating(program.reviews)}
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(program.date)} at {program.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {program.venue}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        {program.bookingType === 'group' && program.numberOfTeams
                          ? `${program.numberOfTeams} teams (max ${program.maxGroupMembers || 0} members/team)`
                          : `${program.seatLimit} seats available`
                        }
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-lg font-bold text-green-600">
                          {program.ticketPrice === 0 ? 'Free' : `₹${program.ticketPrice}`}
                        </span>
                      </div>
                      
                      {user && user.role === 'STUDENT' ? (
                        <Link
                          to={`/book-program/${program.id}`}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center group"
                        >
                          Register
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : !user ? (
                        <Link
                          to="/login"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center group"
                        >
                          Login to Register
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Student access only
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to All Festivals
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FestDetails;