import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Edit, Trash2, Users, Clock, MapPin, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ExcelDownload from '../components/ExcelDownload';

interface Program {
  id: number;
  title: string;
  description: string;
  type: 'HACKATHON' | 'WORKSHOP' | 'COMPETITION' | 'SEMINAR';
  date: string;
  time: string;
  venue: string;
  bookingType?: 'solo' | 'group';
  seatLimit: number;
  ticketPrice: number;
  numberOfTeams?: number;
  maxGroupMembers?: number;
}

interface Fest {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isPublic: boolean;
  programs: Program[];
}

function CollegeDashboard() {
  const { user } = useAuth();
  const [fests, setFests] = useState<Fest[]>([]);
  const [showCreateFest, setShowCreateFest] = useState(false);
  const [showCreateProgram, setShowCreateProgram] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedFestId, setExpandedFestId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [festForm, setFestForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    imageUrl: ''
  });

  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    type: 'WORKSHOP' as const,
    date: '',
    time: '',
    venue: '',
    bookingType: 'solo' as 'solo' | 'group',
    seatLimit: 0,
    ticketPrice: 0,
    numberOfTeams: 0,
    maxGroupMembers: 0
  });

  useEffect(() => {
    if (user?.id) {
      fetchCollegeFests();
    }
  }, [user]);

  const fetchCollegeFests = async () => {
    try {
      console.log(`Fetching fests for college ${user?.id}`);
      const response = await fetch(`http://localhost:3048/api/colleges/${user?.id}/fests`);
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded fests:', data);
        // Debug: Log program data to see what fields are available
        data.forEach((fest: any) => {
          if (fest.programs && Array.isArray(fest.programs)) {
            fest.programs.forEach((program: any) => {
              console.log('Program:', program.title, {
                seatLimit: program.seatLimit,
                bookingType: program.bookingType,
                numberOfTeams: program.numberOfTeams,
                maxGroupMembers: program.maxGroupMembers
              });
            });
          }
        });
        setFests(data);
      } else {
        console.error('Failed to fetch fests:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching fests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side date validation
    if (festForm.startDate && festForm.endDate) {
      const startDate = new Date(festForm.startDate);
      const endDate = new Date(festForm.endDate);
      
      if (startDate > endDate) {
        alert('Start date cannot be after end date. Please select valid dates.');
        return;
      }
      
      if (startDate < new Date()) {
        alert('Start date cannot be in the past. Please select a future date.');
        return;
      }
    }
    
    try {
      const response = await fetch(`http://localhost:3048/colleges/${user?.id}/fests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(festForm),
      });
      
      if (response.ok) {
        await fetchCollegeFests();
        setShowCreateFest(false);
        setFestForm({ title: '', description: '', startDate: '', endDate: '', imageUrl: '' });
      } else {
        const errorData = await response.json();
        alert(`Error creating fest: ${errorData.message || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error creating fest:', error);
      alert('Error creating fest. Please try again.');
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCreateProgram) return;

    // Map frontend fields to backend fields
    const programData = {
      title: programForm.title,
      description: programForm.description,
      type: programForm.type,
      date: programForm.date,
      time: programForm.time,
      venue: programForm.venue,
      bookingType: programForm.bookingType,
      seatLimit: programForm.bookingType === 'solo' ? programForm.seatLimit : 0,
      ticketPrice: programForm.ticketPrice,
      numberOfTeams: programForm.bookingType === 'group' ? programForm.numberOfTeams : null,
      maxGroupMembers: programForm.bookingType === 'group' ? programForm.maxGroupMembers : null
    };

    try {
      const response = await fetch(`http://localhost:3048/api/programs/create/${showCreateProgram}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
      });
      
      if (response.ok) {
        await fetchCollegeFests();
        setShowCreateProgram(null);
        setProgramForm({
          title: '',
          description: '',
          type: 'WORKSHOP',
          date: '',
          time: '',
          venue: '',
          bookingType: 'solo',
          seatLimit: 0,
          ticketPrice: 0,
          numberOfTeams: 0,
          maxGroupMembers: 0
        });
      }
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const handleDeleteProgram = async (programId: number, festId: number) => {
    if (window.confirm('Are you sure you want to delete this program? This will remove it from the system.')) {
      try {
        // Try to call backend DELETE endpoint for programs
        const response = await fetch(`http://localhost:3048/api/programs/${programId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove from local state and refresh data
          setFests(prevFests => prevFests.map(fest => {
            if (fest.id === festId) {
              return {
                ...fest,
                programs: Array.isArray(fest.programs) ? 
                  fest.programs.filter(program => program.id !== programId) : []
              };
            }
            return fest;
          }));
          await fetchCollegeFests(); // Refresh to ensure consistency
          
          // Show success message
          alert('Program deleted successfully from the system!');
        } else if (response.status === 404) {
          // If endpoint doesn't exist, remove from frontend only
          setFests(prevFests => prevFests.map(fest => {
            if (fest.id === festId) {
              return {
                ...fest,
                programs: Array.isArray(fest.programs) ? 
                  fest.programs.filter(program => program.id !== programId) : []
              };
            }
            return fest;
          }));
          
          alert('Program removed from your dashboard! Note: Backend program deletion endpoint not configured.');
        } else {
          // For other errors, show generic message
          alert('Error deleting program. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('Error deleting program. Please try again.');
      }
    }
  };

  const handleDeleteFest = async (festId: number) => {
    if (window.confirm('Are you sure you want to delete this festival? This will permanently remove it from the system.')) {
      try {
        console.log(`Attempting to delete festival ${festId} for college ${user?.id}`);
        
        // Call the backend DELETE endpoint
        const response = await fetch(`http://localhost:3048/api/colleges/${user?.id}/fests/${festId}`, {
          method: 'DELETE',
        });
        
        console.log(`Delete response status: ${response.status}`);
        
        if (response.ok) {
          // Remove from local state and refresh data
          setFests(prevFests => prevFests.filter(fest => fest.id !== festId));
          await fetchCollegeFests(); // Refresh to ensure consistency
          
          // Show success message
          alert('Festival deleted successfully from the system!');
        } else if (response.status === 403) {
          // Get the error message from response
          const errorText = await response.text();
          console.log('403 Error details:', errorText);
          
          // Show more specific error message
          alert(`Cannot delete festival: ${errorText || 'You do not have permission to delete this festival. It may be approved or belong to another college.'}`);
        } else if (response.status === 404) {
          alert('Festival not found. It may have already been deleted.');
        } else {
          // For other errors, show generic message
          const errorText = await response.text();
          console.log(`Error ${response.status}:`, errorText);
          alert(`Error deleting festival (${response.status}): ${errorText || 'Please try again.'}`);
        }
      } catch (error) {
        console.error('Error deleting fest:', error);
        alert('Error deleting festival. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getProgramTypeColor = (type: string) => {
    switch (type) {
      case 'HACKATHON': return 'bg-red-100 text-red-800';
      case 'WORKSHOP': return 'bg-blue-100 text-blue-800';
      case 'COMPETITION': return 'bg-green-100 text-green-800';
      case 'SEMINAR': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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

  // Dynamic calculations for dashboard statistics
  const totalEvents = fests.length;
  const activeEvents = fests.filter(f => f.approvalStatus === 'APPROVED').length;
  const pendingEvents = fests.filter(f => f.approvalStatus === 'PENDING').length;
  const rejectedEvents = fests.filter(f => f.approvalStatus === 'REJECTED').length;
  
  // Calculate total programs across all festivals
  const totalPrograms = fests.reduce((sum, fest) => 
    sum + (Array.isArray(fest.programs) ? fest.programs.length : 0), 0);
  
  // Calculate total capacity across all programs
  const totalCapacity = fests.reduce((sum, fest) => 
    sum + (Array.isArray(fest.programs) ? 
      fest.programs.reduce((pSum, prog) => pSum + prog.seatLimit, 0) : 0), 0);
  
  // Calculate average programs per festival
  const avgProgramsPerFest = totalEvents > 0 ? (totalPrograms / totalEvents).toFixed(1) : '0';
  
  // Calculate festival success rate
  const successRate = totalEvents > 0 ? Math.round((activeEvents / totalEvents) * 100) : 0;
  
  // Calculate approved events count
  const approvedEvents = fests.filter(fest => fest.approvalStatus === 'APPROVED').length;
  
  // Calculate upcoming events (next 30 days)
  const upcomingEvents = fests.filter(fest => {
    const festStartDate = new Date(fest.startDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return festStartDate > new Date() && festStartDate <= thirtyDaysFromNow;
  }).length;

  // Filter festivals based on search and status
  const filteredFests = fests.filter(fest => {
    const matchesSearch = searchTerm === '' || 
      fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'approved' && fest.approvalStatus === 'APPROVED') ||
      (filterStatus === 'pending' && fest.approvalStatus === 'PENDING') ||
      (filterStatus === 'rejected' && fest.approvalStatus === 'REJECTED') ||
      (filterStatus === 'upcoming' && new Date(fest.startDate) > new Date());
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Stat Cards */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">College Dashboard</h1>
          </div>
          <button
            onClick={() => setShowCreateFest(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Festival
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{totalEvents}</p>
                <p className="text-xs text-green-600 mt-1">+{upcomingEvents} upcoming</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Approved Events</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{approvedEvents}</p>
                <p className="text-xs text-green-600 mt-1">{approvedEvents} approved</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Programs</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{totalPrograms}</p>
                <p className="text-xs text-green-600 mt-1">~{avgProgramsPerFest} per event</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{upcomingEvents}</p>
                <p className="text-xs text-green-600 mt-1">Next 30 days</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        

        {/* My Events Table */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Events ({filteredFests.length} of {fests.length})
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                💡 <strong>Deletion Rules:</strong> Only pending and rejected festivals can be deleted. Approved festivals cannot be deleted.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <svg className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 animate-gradient-x">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Seats</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredFests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      {fests.length === 0 ? (
                        "No events found."
                      ) : (
                        "No events match your search criteria."
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredFests.map((fest) => (
                    <React.Fragment key={fest.id}>
                      <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:via-purple-50 hover:to-pink-50 transition-all duration-300 group">
                        <td className="px-4 py-2 font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 flex items-center">
                          <button
                            onClick={() => setExpandedFestId(expandedFestId === fest.id ? null : fest.id)}
                            className="mr-2 focus:outline-none"
                            aria-label={expandedFestId === fest.id ? 'Collapse' : 'Expand'}
                          >
                            {expandedFestId === fest.id ? (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          {fest.title}
                        </td>
                        <td className="px-4 py-2 text-gray-700">{formatDate(fest.startDate)} - {formatDate(fest.endDate)}</td>
                        <td className="px-4 py-2 text-gray-700">{(Array.isArray(fest.programs) ? fest.programs : []).reduce((acc, prog) => acc + prog.seatLimit, 0)}</td>
                        <td className="px-4 py-2 text-gray-700">₹{(Array.isArray(fest.programs) ? fest.programs : []).reduce((acc, prog) => acc + prog.ticketPrice, 0)}</td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(fest.approvalStatus)}`}>{fest.approvalStatus}</span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setShowCreateProgram(fest.id)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-2 transition-all duration-200 shadow hover:from-blue-600 hover:to-purple-600"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFest(fest.id)}
                              className={`rounded-full p-2 transition-all duration-200 shadow ${
                                fest.approvalStatus === 'APPROVED' 
                                  ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-500' 
                                  : 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600'
                              }`}
                              title={fest.approvalStatus === 'APPROVED' 
                                ? 'Cannot delete approved festivals' 
                                : 'Delete festival'
                              }
                              disabled={fest.approvalStatus === 'APPROVED'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedFestId === fest.id && (Array.isArray(fest.programs) ? fest.programs : []).length > 0 && (
                        <tr>
                          <td colSpan={6} className="bg-gray-50 px-6 py-4 animate-fade-in">
                            <div className="text-sm font-semibold text-gray-700 mb-2">Programs</div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Title</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Type</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Date</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Time</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Venue</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Capacity</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Price</th>
                                    <th className="px-2 py-1 text-left font-medium text-gray-500">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(Array.isArray(fest.programs) ? fest.programs : []).map((program) => (
                                    <tr key={program.id} className="hover:bg-blue-50 transition">
                                      <td className="px-2 py-1 font-semibold text-gray-900">{program.title}</td>
                                      <td className={`px-2 py-1`}><span className={`px-2 py-1 rounded text-xs font-medium ${getProgramTypeColor(program.type)}`}>{program.type}</span></td>
                                      <td className="px-2 py-1 text-gray-700">{formatDate(program.date)}</td>
                                      <td className="px-2 py-1 text-gray-700">{program.time}</td>
                                      <td className="px-2 py-1 text-gray-700">{program.venue}</td>
                                      <td className="px-2 py-1 text-gray-700">
                                        {program.bookingType === 'group' && program.numberOfTeams
                                          ? `${program.numberOfTeams} teams`
                                          : program.seatLimit || 0
                                        }
                                      </td>
                                      <td className="px-2 py-1 text-gray-700">{program.ticketPrice === 0 ? 'Free' : `₹${program.ticketPrice}`}</td>
                                      <td className="px-2 py-1">
                                        <button
                                          onClick={() => handleDeleteProgram(program.id, fest.id)}
                                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all duration-200"
                                          title="Delete Program"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Excel Download Section */}
        <div className="mb-8">
          <ExcelDownload 
            collegeId={user?.id || 0} 
            collegeName={user?.username || 'Your College'} 
          />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-100">
            {/* Example activities, replace with real data if available */}
            <li className="flex items-center space-x-3 py-3">
              <span className="bg-green-100 text-green-600 rounded-full p-2"><Users className="h-5 w-5" /></span>
              <div>
                <div className="font-semibold text-gray-900">test - approved</div>
                <div className="text-gray-500 text-sm">7/11/2025</div>
              </div>
            </li>
            <li className="flex items-center space-x-3 py-3">
              <span className="bg-yellow-100 text-yellow-600 rounded-full p-2"><Clock className="h-5 w-5" /></span>
              <div>
                <div className="font-semibold text-gray-900">demo1 - pending</div>
                <div className="text-gray-500 text-sm">7/11/2025</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Create Fest Modal */}
        {showCreateFest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Festival</h3>
              <form onSubmit={handleCreateFest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={festForm.title}
                    onChange={(e) => setFestForm({ ...festForm, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={festForm.description}
                    onChange={(e) => setFestForm({ ...festForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={festForm.startDate}
                      onChange={(e) => setFestForm({ ...festForm, startDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      required
                      min={festForm.startDate || new Date().toISOString().split('T')[0]}
                      value={festForm.endDate}
                      onChange={(e) => setFestForm({ ...festForm, endDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
                  <input
                    type="url"
                    value={festForm.imageUrl}
                    onChange={(e) => setFestForm({ ...festForm, imageUrl: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                  >
                    Create Festival
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateFest(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Program Modal */}
        {showCreateProgram && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Program</h3>
              <form onSubmit={handleCreateProgram} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={programForm.title}
                      onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={programForm.type}
                      onChange={(e) => setProgramForm({ ...programForm, type: e.target.value as any })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="WORKSHOP">Workshop</option>
                      <option value="HACKATHON">Hackathon</option>
                      <option value="COMPETITION">Competition</option>
                      <option value="SEMINAR">Seminar</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={programForm.description}
                    onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      required
                      value={programForm.date}
                      onChange={(e) => setProgramForm({ ...programForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      required
                      value={programForm.time}
                      onChange={(e) => setProgramForm({ ...programForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <input
                      type="text"
                      required
                      value={programForm.venue}
                      onChange={(e) => setProgramForm({ ...programForm, venue: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Booking Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Booking Type</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bookingType"
                        value="solo"
                        checked={programForm.bookingType === 'solo'}
                        onChange={(e) => setProgramForm({ ...programForm, bookingType: e.target.value as 'solo' | 'group' })}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Solo Booking</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="bookingType"
                        value="group"
                        checked={programForm.bookingType === 'group'}
                        onChange={(e) => setProgramForm({ ...programForm, bookingType: e.target.value as 'solo' | 'group' })}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Group Booking</span>
                    </label>
                  </div>
                </div>

                {/* Conditional Fields based on Booking Type */}
                {programForm.bookingType === 'solo' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seat Limit</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={programForm.seatLimit}
                        onChange={(e) => setProgramForm({ ...programForm, seatLimit: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={programForm.ticketPrice}
                        onChange={(e) => setProgramForm({ ...programForm, ticketPrice: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Teams</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={programForm.numberOfTeams}
                        onChange={(e) => setProgramForm({ ...programForm, numberOfTeams: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Members</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={programForm.maxGroupMembers}
                        onChange={(e) => setProgramForm({ ...programForm, maxGroupMembers: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Price (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={programForm.ticketPrice}
                        onChange={(e) => setProgramForm({ ...programForm, ticketPrice: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
                  >
                    Add Program
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateProgram(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CollegeDashboard;