import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, Clock, ArrowRight, Trophy, Sparkles, Award, Globe, Shield, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface Program {
  id: number;
  title: string;
  type: string;
  bookingType?: 'solo' | 'group';
  seatLimit?: number;
  numberOfTeams?: number;
  maxGroupMembers?: number;
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

function Home() {
  const [fests, setFests] = useState<Fest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const festivalsPerPage = 6;

  useEffect(() => {
    setIsVisible(true);
    fetchPublicFests();
  }, []);

  const fetchPublicFests = async () => {
    try {
      const response = await fetch('http://localhost:3048/api/public/fests', {
        mode: 'cors',
        credentials: 'omit'
      });
      if (response.ok) {
        const data = await response.json();
        setFests(data);
      } else {
        console.warn('Failed to fetch fests from backend:', response.status, response.statusText);
        setFests(getDemoFests());
      }
    } catch (error) {
      console.error('Backend connection failed:', error);
      setFests(getDemoFests());
    } finally {
      setLoading(false);
    }
  };

  // Filter festivals based on search term and selected filter
  const filteredFests = fests.filter(fest => {
    const matchesSearch = searchTerm === '' || 
      fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.college.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'tech' && fest.programs.some(p => p.type === 'HACKATHON' || p.type === 'WORKSHOP')) ||
      (selectedFilter === 'cultural' && fest.programs.some(p => p.type === 'COMPETITION' || p.type === 'SEMINAR')) ||
      (selectedFilter === 'solo' && fest.programs.some(p => p.bookingType === 'solo' || !p.bookingType)) ||
      (selectedFilter === 'group' && fest.programs.some(p => p.bookingType === 'group'));
    
    return matchesSearch && matchesFilter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFests.length / festivalsPerPage);
  const startIndex = (currentPage - 1) * festivalsPerPage;
  const endIndex = startIndex + festivalsPerPage;
  const currentFests = filteredFests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Demo data for when backend is not available
  const getDemoFests = (): Fest[] => [
    {
      id: 1,
      title: "TechFest 2024",
      description: "Annual technology festival featuring hackathons, workshops, and tech talks by industry experts.",
      startDate: "2024-03-15",
      endDate: "2024-03-17",
      college: {
        name: "ABC Institute of Technology"
      },
      programs: [
        {
          id: 1,
          title: "Web Development Workshop",
          type: "WORKSHOP"
        },
        {
          id: 2,
          title: "AI/ML Hackathon",
          type: "HACKATHON"
        }
      ]
    },
    {
      id: 2,
      title: "Cultural Fest 2024",
      description: "Celebrate arts, music, and culture with performances, competitions, and exhibitions.",
      startDate: "2024-04-20",
      endDate: "2024-04-22",
      college: {
        name: "XYZ University"
      },
      programs: [
        {
          id: 3,
          title: "Dance Competition",
          type: "COMPETITION"
        },
        {
          id: 4,
          title: "Music Concert",
          type: "SEMINAR"
        }
      ]
    }
  ];

  // Reference-inspired features and stats
  const features = [
    {
      icon: Calendar,
      title: 'Easy Event Discovery',
      description: 'Browse and discover exciting college events from across the country with our intuitive platform.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Simple Registration',
      description: 'Quick and secure event registration with integrated payment gateway and instant confirmation.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Quality Assurance',
      description: 'All events are carefully reviewed and approved by our expert admin team for quality assurance.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Star,
      title: 'Reviews & Ratings',
      description: 'Read authentic reviews from other students and share your own experiences with the community.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { number: `${fests.length}+`, label: 'Active Festivals', icon: Calendar },
    { number: '10,000+', label: 'Happy Students', icon: Users },
    { number: '500+', label: 'College Partners', icon: Award },
    { number: '1,000+', label: 'Events Hosted', icon: Trophy },
    { number: '50+', label: 'Cities Covered', icon: Globe }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <span className="handwriting-accent gradient-text text-4xl md:text-5xl block mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Welcome to the Future of
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
                College Events
                <span className="block gradient-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">& Festivals</span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join thousands of students exploring exciting college festivals, tech events, 
              cultural programs, and more. Your next amazing experience is just a click away!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <a
                href="#festivals"
                className="premium-button group bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold px-8 py-4 rounded-xl flex items-center justify-center"
              >
                <Calendar className="h-6 w-6 mr-2 group-hover:animate-bounce-gentle" />
                <span>Explore Festivals</span>
                <Sparkles className="h-5 w-5 ml-2 group-hover:animate-spin" />
              </a>
              <Link
                to="/register"
                className="bg-white/80 backdrop-blur-sm text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl hover:bg-blue-100 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <Users className="h-6 w-6" />
                <span>Join Our Community</span>
              </Link>
            </div>
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 mt-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Verified Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Festivals Section with Search and Filter */}
      <section id="festivals" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Upcoming Festivals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover exciting events happening at colleges near you
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-lg w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search festivals, colleges, or events..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-gray-700 placeholder-gray-500 transition-all duration-300 hover:border-gray-300"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setCurrentPage(1); // Reset to first page when filtering
                    }}
                    className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-gray-700 appearance-none cursor-pointer transition-all duration-300 hover:border-gray-300"
                  >
                    <option value="all">All Events</option>
                    <option value="tech">Tech Events</option>
                    <option value="cultural">Cultural Events</option>
                    <option value="solo">Solo Bookings</option>
                    <option value="group">Group Bookings</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">
                    Showing <span className="text-blue-600 font-semibold">{currentFests.length}</span> of <span className="text-blue-600 font-semibold">{filteredFests.length}</span> festivals
                    {searchTerm && (
                      <span className="text-gray-500"> for "<span className="text-blue-600">{searchTerm}</span>"</span>
                    )}
                    {selectedFilter !== 'all' && (
                      <span className="text-gray-500"> ({selectedFilter} events)</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {filteredFests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedFilter !== 'all' ? 'No matching festivals' : 'No festivals available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Check back soon for upcoming events!'}
                </p>
                {(searchTerm || selectedFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFilter('all');
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear filters
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Festivals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {currentFests.map((fest) => (
                  <div key={fest.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-200">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {fest.imageUrl ? (
                        <img 
                          src={fest.imageUrl} 
                          alt={fest.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="h-16 w-16 text-white opacity-60" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full shadow">
                        <span className="text-sm font-medium text-blue-600">
                          {(fest.programs && fest.programs.length) ? fest.programs.length : 0} Programs
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {fest.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {fest.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          {fest.college?.name || "Unknown College"}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          {formatDate(fest.startDate)} - {formatDate(fest.endDate)}
                        </div>
                      </div>
                      
                      {/* Booking Type Information */}
                      {fest.programs && fest.programs.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <Users className="h-4 w-4 mr-2 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">Event Types:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const soloCount = fest.programs.filter(p => p.bookingType === 'solo' || !p.bookingType).length;
                              const groupCount = fest.programs.filter(p => p.bookingType === 'group').length;
                              const badges = [];
                              
                              if (soloCount > 0) {
                                badges.push(
                                  <span key="solo" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <Users className="h-3 w-3 mr-1" />
                                    {soloCount} Solo
                                  </span>
                                );
                              }
                              
                              if (groupCount > 0) {
                                badges.push(
                                  <span key="group" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    <Users className="h-3 w-3 mr-1" />
                                    {groupCount} Group
                                  </span>
                                );
                              }
                              
                              return badges.length > 0 ? badges : (
                                <span className="text-xs text-gray-500">Event types not specified</span>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                      <Link
                        to={`/fest/${fest.id}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center group"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 min-w-[48px] ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                        : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="handwriting-accent text-blue-600 text-3xl block mb-4">
              Trusted by thousands
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Impact in Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-slide-up bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="handwriting-accent text-purple-600 text-3xl block mb-4">
              Why students love us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most comprehensive platform for college event discovery and management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="professional-card p-8 group animate-slide-up bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="handwriting-accent text-blue-600 text-3xl block mb-4">
              Get in touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or need support? Our team is here to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Contact */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Email Us</h3>
              <div className="space-y-2">
                <a href="mailto:hello@festorg.com" className="block text-blue-600 hover:text-blue-700 transition-colors font-medium">
                  hello@festorg.com
                </a>
                <a href="mailto:support@festorg.com" className="block text-blue-600 hover:text-blue-700 transition-colors font-medium">
                  support@festorg.com
                </a>
              </div>
              <p className="text-gray-500 text-sm mt-4">We'll respond within 24 hours</p>
            </div>

            {/* Phone Contact */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Call Us</h3>
              <a href="tel:+918012345678" className="block text-green-600 hover:text-green-700 transition-colors font-medium text-lg">
                +91 801 234 5678
              </a>
              <p className="text-gray-500 text-sm mt-4">Mon-Fri: 9AM-6PM IST</p>
            </div>

            {/* Address Contact */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Visit Us</h3>
              <div className="text-gray-600 space-y-1">
                <p>123 Innovation Drive</p>
                <p>Tech Park, Bangalore 560001</p>
                <p>Karnataka, India</p>
              </div>
              <p className="text-gray-500 text-sm mt-4">Main Office</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="handwriting-accent text-white/90 text-4xl block mb-4">
            Your journey starts here
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Discover Amazing Events?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Register now and get access to exclusive college festivals, workshops, and competitions.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <Users className="h-6 w-6" />
            <span>Get Started Today</span>
            <Sparkles className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl mr-3">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">FestOrg</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Connecting students with amazing college events and festivals across India. 
                Your gateway to unforgettable experiences and opportunities.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.847-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12.013C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Partners</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 FestOrg. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;