import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Users, Trophy, Star, ArrowRight, Sparkles, Award, Globe, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    { number: '10,000+', label: 'Happy Students', icon: Users },
    { number: '500+', label: 'College Partners', icon: Award },
    { number: '1,000+', label: 'Events Hosted', icon: Calendar },
    { number: '50+', label: 'Cities Covered', icon: Globe }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'TechFest 2024',
      college: 'MIT College',
      date: '2024-03-15',
      price: 299,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Technology',
      attendees: 450
    },
    {
      id: 2,
      title: 'Cultural Carnival',
      college: 'Arts University',
      date: '2024-04-20',
      price: 199,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Cultural',
      attendees: 680
    },
    {
      id: 3,
      title: 'Innovation Summit',
      college: 'Business School',
      date: '2024-05-10',
      price: 499,
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Business',
      attendees: 320
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <span className="handwriting-accent gradient-text text-4xl md:text-5xl block mb-2">
                Welcome to the Future of
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
                College Events
                <span className="block gradient-text">& Festivals</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join thousands of students exploring exciting college festivals, tech events, 
              cultural programs, and more. Your next amazing experience is just a click away!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/events"
                className="premium-button group"
              >
                <Calendar className="h-6 w-6 mr-2 group-hover:animate-bounce-gentle" />
                <span>Explore Events</span>
                <Sparkles className="h-5 w-5 ml-2 group-hover:animate-spin" />
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-white/80 backdrop-blur-sm text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Users className="h-6 w-6" />
                  <span>Join Our Community</span>
                </Link>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
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

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="handwriting-accent text-blue-600 text-3xl block mb-4">
              Trusted by thousands
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Impact in Numbers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
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
                className="professional-card p-8 group animate-slide-up"
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

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="handwriting-accent text-green-600 text-3xl block mb-4">
                Don't miss out
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Trending Events
              </h2>
              <p className="text-xl text-gray-600">
                Join these exciting upcoming events before they sell out!
              </p>
            </div>
            <Link
              to="/events"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold group"
            >
              <span>View All Events</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="professional-card overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ₹{event.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="casual-text text-blue-600">{event.college}</span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{event.attendees}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-center block group-hover:shadow-lg"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <span>View All Events</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
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
            Join thousands of students who are already discovering life-changing experiences through FestPortal. 
            Your next adventure awaits!
          </p>
          {!user ? (
            <Link
              to="/register"
              className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <Users className="h-6 w-6" />
              <span>Get Started Today</span>
              <Sparkles className="h-6 w-6" />
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              <ArrowRight className="h-6 w-6" />
              <span>Go to Dashboard</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;