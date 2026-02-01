import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Users, Calendar, TrendingUp, AlertCircle, Shield, Activity, BarChart3, Settings, Bell, Search, Filter, Download, RefreshCw } from 'lucide-react';
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
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  programs: Program[];
}

function AdminDashboard() {
  const { user } = useAuth();
  const [pendingFests, setPendingFests] = useState<Fest[]>([]);
  const [approvedFests, setApprovedFests] = useState<Fest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedFest, setExpandedFest] = useState<number | null>(null);
  const [expandedApprovedFest, setExpandedApprovedFest] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingFests();
    fetchApprovedFests();
  }, []);

  const fetchPendingFests = async () => {
    try {
      const response = await fetch('http://localhost:3048/admin/pending-fests');
      if (response.ok) {
        const data = await response.json();
        setPendingFests(data);
      }
    } catch (error) {
      console.error('Error fetching pending fests:', error);
    }
  };

  const fetchApprovedFests = async () => {
    try {
      const response = await fetch('http://localhost:3048/admin/public-fests');
      if (response.ok) {
        const data = await response.json();
        setApprovedFests(data);
      }
    } catch (error) {
      console.error('Error fetching approved fests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (festId: number) => {
    setActionLoading(festId);
    try {
              const response = await fetch(`http://localhost:3048/admin/fests/${festId}/approve`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchPendingFests();
        await fetchApprovedFests();
      }
    } catch (error) {
      console.error('Error approving fest:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (festId: number) => {
    setActionLoading(festId);
    try {
              const response = await fetch(`http://localhost:3048/admin/fests/${festId}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        await fetchPendingFests();
      }
    } catch (error) {
      console.error('Error rejecting fest:', error);
    } finally {
      setActionLoading(null);
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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const toggleFestivalDetails = (festId: number) => {
    setExpandedFest(expandedFest === festId ? null : festId);
  };

  const toggleApprovedFestivalDetails = (festId: number) => {
    setExpandedApprovedFest(expandedApprovedFest === festId ? null : festId);
  };

  // Filter and search functionality
  const filteredPendingFests = pendingFests.filter(fest => {
    const matchesSearch = searchTerm === '' || 
      fest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.college?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'pending' && fest.approvalStatus === 'PENDING') ||
              (filterStatus === 'recent' && new Date(fest.startDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (filterStatus === 'high-revenue' && Array.isArray(fest.programs) && 
        fest.programs.reduce((sum, p) => sum + (p.ticketPrice * p.seatLimit), 0) > 10000) ||
      (filterStatus === 'many-programs' && Array.isArray(fest.programs) && fest.programs.length > 3);
    
    return matchesSearch && matchesFilter;
  });

  const totalPrograms = approvedFests.reduce((sum, fest) => sum + (Array.isArray(fest.programs) ? fest.programs.length : 0), 0);
  const totalColleges = new Set(approvedFests.map(fest => fest.college?.name)).size;
  
  // Calculate College Performance Multiplier
  const uniqueColleges = new Set([
    ...approvedFests.map(fest => fest.college?.name),
    ...pendingFests.map(fest => fest.college?.name)
  ]).size;
  
  const collegePerformanceMultiplier = uniqueColleges > 0 ? 
    Math.round((totalPrograms / uniqueColleges) * 20 + (approvedFests.length / uniqueColleges) * 25 + (pendingFests.length * 2)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">Welcome back, <span className="font-bold text-blue-600">{user?.username}</span></p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2 rounded-lg hover:bg-white transition-all duration-200">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm border border-gray-200 p-2 rounded-lg hover:bg-white transition-all duration-200">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">College Performance</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{collegePerformanceMultiplier}</p>
                <p className="text-xs text-green-600 mt-1">+{Math.round(collegePerformanceMultiplier * 0.1)} from last week</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">{approvedFests.length + pendingFests.length}</p>
                <p className="text-xs text-green-600 mt-1">+5 new this week</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl group-hover:bg-green-100 transition-colors">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Colleges</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{totalColleges}</p>
                <p className="text-xs text-green-600 mt-1">+3 new registrations</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Programs</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{totalPrograms}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        

        {/* Pending Approvals */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Pending Approvals ({filteredPendingFests.length} of {pendingFests.length})
            </h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                <option value="all">All Festivals</option>
                <option value="pending">Pending Only</option>
                <option value="recent">Recent (7 days)</option>
                <option value="high-revenue">High Revenue</option>
                <option value="many-programs">Many Programs</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-orange-50 to-red-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredPendingFests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-gray-400">
                        {pendingFests.length === 0 ? (
                          <>
                            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                            <p className="text-lg font-medium">All caught up!</p>
                            <p className="text-sm">No festivals pending approval at the moment.</p>
                          </>
                        ) : (
                          <>
                            <Search className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                            <p className="text-lg font-medium">No results found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPendingFests.map((fest) => (
                    <React.Fragment key={fest.id}>
                      <tr className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleFestivalDetails(fest.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {expandedFest === fest.id ? (
                                <Eye className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{fest.title}</div>
                              <div className="text-sm text-gray-500">{fest.description?.substring(0, 60)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 group-hover:text-red-700 transition-colors">
                          {fest.college?.name || "Unknown College"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(fest.startDate)} - {formatDate(fest.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {Array.isArray(fest.programs) ? fest.programs.length : 0} programs
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(fest.id)}
                              disabled={actionLoading === fest.id}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center group"
                            >
                              {actionLoading === fest.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(fest.id)}
                              disabled={actionLoading === fest.id}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center group"
                            >
                              {actionLoading === fest.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <XCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                              )}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Detailed Festival Information */}
                      {expandedFest === fest.id && (
                        <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <td colSpan={5} className="px-6 py-6">
                            <div className="space-y-6">
                              {/* Festival Details */}
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                  Festival Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Title</p>
                                    <p className="text-gray-900 font-semibold">{fest.title}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">College</p>
                                    <p className="text-gray-900 font-semibold">{fest.college?.name || "Unknown College"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Date Range</p>
                                    <p className="text-gray-900 font-semibold">{formatDate(fest.startDate)} - {formatDate(fest.endDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Programs Count</p>
                                    <p className="text-gray-900 font-semibold">{Array.isArray(fest.programs) ? fest.programs.length : 0} programs</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <p className="text-gray-900">{fest.description}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Programs Details */}
                              {Array.isArray(fest.programs) && fest.programs.length > 0 && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                                    Programs ({fest.programs.length})
                                  </h3>
                                  <div className="space-y-4">
                                    {fest.programs.map((program, index) => (
                                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Program Title</p>
                                            <p className="text-gray-900 font-semibold">{program.title}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Type</p>
                                            <p className="text-gray-900 font-semibold">{program.type}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Booking Type</p>
                                            <div className="flex items-center">
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                program.bookingType === 'group' 
                                                  ? 'bg-purple-100 text-purple-800' 
                                                  : 'bg-blue-100 text-blue-800'
                                              }`}>
                                                {program.bookingType === 'group' ? 'Group' : 'Solo'}
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Ticket Price</p>
                                            <p className="text-gray-900 font-semibold">₹{program.ticketPrice}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Date</p>
                                            <p className="text-gray-900 font-semibold">{formatDate(program.date)}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Time</p>
                                            <p className="text-gray-900 font-semibold">{program.time}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Venue</p>
                                            <p className="text-gray-900 font-semibold">{program.venue}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Capacity</p>
                                            <p className="text-gray-900 font-semibold">
                                              {program.bookingType === 'group' && program.numberOfTeams
                                                ? `${program.numberOfTeams} teams (max ${program.maxGroupMembers || 0} members/team)`
                                                : `${program.seatLimit || 0} seats`
                                              }
                                            </p>
                                          </div>
                                          <div className="md:col-span-4">
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-gray-900">{program.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Analysis Summary */}
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                                  Analysis Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{Array.isArray(fest.programs) ? fest.programs.length : 0}</p>
                                    <p className="text-sm text-gray-500">Total Programs</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                      ₹{Array.isArray(fest.programs) ? 
                                        fest.programs.reduce((sum, p) => {
                                          const capacity = p.bookingType === 'group' && p.numberOfTeams 
                                            ? p.numberOfTeams * (p.maxGroupMembers || 1) 
                                            : p.seatLimit || 0;
                                          return sum + (p.ticketPrice * capacity);
                                        }, 0).toLocaleString() : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Potential Revenue</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                      {Array.isArray(fest.programs) ? 
                                        fest.programs.reduce((sum, p) => {
                                          const capacity = p.bookingType === 'group' && p.numberOfTeams 
                                            ? p.numberOfTeams * (p.maxGroupMembers || 1) 
                                            : p.seatLimit || 0;
                                          return sum + capacity;
                                        }, 0) : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Capacity</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                      {Array.isArray(fest.programs) ? 
                                        fest.programs.filter(p => p.bookingType === 'group').length : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Group Programs</p>
                                  </div>
                                </div>
                                
                                {/* Detailed Booking Type Analysis */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Solo Programs Analysis
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Count:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs.filter(p => p.bookingType === 'solo' || !p.bookingType).length : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Seats:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs
                                              .filter(p => p.bookingType === 'solo' || !p.bookingType)
                                              .reduce((sum, p) => sum + (p.seatLimit || 0), 0) : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg Seats/Program:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            (() => {
                                              const soloPrograms = fest.programs.filter(p => p.bookingType === 'solo' || !p.bookingType);
                                              const totalSeats = soloPrograms.reduce((sum, p) => sum + (p.seatLimit || 0), 0);
                                              return soloPrograms.length > 0 ? Math.round(totalSeats / soloPrograms.length) : 0;
                                            })() : 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Group Programs Analysis
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Count:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs.filter(p => p.bookingType === 'group').length : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Teams:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs
                                              .filter(p => p.bookingType === 'group')
                                              .reduce((sum, p) => sum + (p.numberOfTeams || 0), 0) : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Max Members/Team:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            (() => {
                                              const groupPrograms = fest.programs.filter(p => p.bookingType === 'group');
                                              const maxMembers = Math.max(...groupPrograms.map(p => p.maxGroupMembers || 0));
                                              return maxMembers > 0 ? maxMembers : 'N/A';
                                            })() : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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

        {/* Approved Events */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-8 border border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-6">
            Approved Events ({approvedFests.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-green-50 to-blue-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">College</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Programs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {approvedFests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="text-gray-400">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                        <p className="text-lg font-medium">No approved events yet</p>
                        <p className="text-sm">Approved events will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  approvedFests.map((fest) => (
                    <React.Fragment key={fest.id}>
                      <tr className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 group">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleApprovedFestivalDetails(fest.id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{fest.title}</div>
                              <div className="text-sm text-gray-500">{fest.description?.substring(0, 60)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700 group-hover:text-blue-700 transition-colors">
                          {fest.college?.name || "Unknown College"}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(fest.startDate)} - {formatDate(fest.endDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {Array.isArray(fest.programs) ? fest.programs.length : 0} programs
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Approved
                          </span>
                        </td>
                      </tr>
                      
                      {/* Detailed Festival Information for Approved Events */}
                      {expandedApprovedFest === fest.id && (
                        <tr className="bg-gradient-to-r from-green-50 to-blue-50">
                          <td colSpan={5} className="px-6 py-6">
                            <div className="space-y-6">
                              {/* Festival Details */}
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                                  Festival Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Title</p>
                                    <p className="text-gray-900 font-semibold">{fest.title}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">College</p>
                                    <p className="text-gray-900 font-semibold">{fest.college?.name || "Unknown College"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Date Range</p>
                                    <p className="text-gray-900 font-semibold">{formatDate(fest.startDate)} - {formatDate(fest.endDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Programs Count</p>
                                    <p className="text-gray-900 font-semibold">{Array.isArray(fest.programs) ? fest.programs.length : 0} programs</p>
                                  </div>
                                  <div className="md:col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Description</p>
                                    <p className="text-gray-900">{fest.description}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Programs Details */}
                              {Array.isArray(fest.programs) && fest.programs.length > 0 && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                                    Programs ({fest.programs.length})
                                  </h3>
                                  <div className="space-y-4">
                                    {fest.programs.map((program, index) => (
                                      <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Program Title</p>
                                            <p className="text-gray-900 font-semibold">{program.title}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Type</p>
                                            <p className="text-gray-900 font-semibold">{program.type}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Booking Type</p>
                                            <div className="flex items-center">
                                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                program.bookingType === 'group' 
                                                  ? 'bg-purple-100 text-purple-800' 
                                                  : 'bg-blue-100 text-blue-800'
                                              }`}>
                                                {program.bookingType === 'group' ? 'Group' : 'Solo'}
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Ticket Price</p>
                                            <p className="text-gray-900 font-semibold">₹{program.ticketPrice}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Date</p>
                                            <p className="text-gray-900 font-semibold">{formatDate(program.date)}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Time</p>
                                            <p className="text-gray-900 font-semibold">{program.time}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Venue</p>
                                            <p className="text-gray-900 font-semibold">{program.venue}</p>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-gray-500">Capacity</p>
                                            <p className="text-gray-900 font-semibold">
                                              {program.bookingType === 'group' && program.numberOfTeams
                                                ? `${program.numberOfTeams} teams (max ${program.maxGroupMembers || 0} members/team)`
                                                : `${program.seatLimit || 0} seats`
                                              }
                                            </p>
                                          </div>
                                          <div className="md:col-span-4">
                                            <p className="text-sm font-medium text-gray-500">Description</p>
                                            <p className="text-gray-900">{program.description}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Analysis Summary for Approved Events */}
                              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                                  Analysis Summary
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">{Array.isArray(fest.programs) ? fest.programs.length : 0}</p>
                                    <p className="text-sm text-gray-500">Total Programs</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                      ₹{Array.isArray(fest.programs) ? 
                                        fest.programs.reduce((sum, p) => {
                                          const capacity = p.bookingType === 'group' && p.numberOfTeams 
                                            ? p.numberOfTeams * (p.maxGroupMembers || 1) 
                                            : p.seatLimit || 0;
                                          return sum + (p.ticketPrice * capacity);
                                        }, 0).toLocaleString() : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Potential Revenue</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                      {Array.isArray(fest.programs) ? 
                                        fest.programs.reduce((sum, p) => {
                                          const capacity = p.bookingType === 'group' && p.numberOfTeams 
                                            ? p.numberOfTeams * (p.maxGroupMembers || 1) 
                                            : p.seatLimit || 0;
                                          return sum + capacity;
                                        }, 0) : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Total Capacity</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                      {Array.isArray(fest.programs) ? 
                                        fest.programs.filter(p => p.bookingType === 'group').length : 0}
                                    </p>
                                    <p className="text-sm text-gray-500">Group Programs</p>
                                  </div>
                                </div>
                                
                                {/* Detailed Booking Type Analysis */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Solo Programs Analysis
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Count:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs.filter(p => p.bookingType === 'solo' || !p.bookingType).length : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Seats:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs
                                              .filter(p => p.bookingType === 'solo' || !p.bookingType)
                                              .reduce((sum, p) => sum + (p.seatLimit || 0), 0) : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Avg Seats/Program:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            (() => {
                                              const soloPrograms = fest.programs.filter(p => p.bookingType === 'solo' || !p.bookingType);
                                              const totalSeats = soloPrograms.reduce((sum, p) => sum + (p.seatLimit || 0), 0);
                                              return soloPrograms.length > 0 ? Math.round(totalSeats / soloPrograms.length) : 0;
                                            })() : 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                                      <Users className="h-4 w-4 mr-2" />
                                      Group Programs Analysis
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Count:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs.filter(p => p.bookingType === 'group').length : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Teams:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            fest.programs
                                              .filter(p => p.bookingType === 'group')
                                              .reduce((sum, p) => sum + (p.numberOfTeams || 0), 0) : 0}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Max Members/Team:</span>
                                        <span className="font-medium">
                                          {Array.isArray(fest.programs) ? 
                                            (() => {
                                              const groupPrograms = fest.programs.filter(p => p.bookingType === 'group');
                                              const maxMembers = Math.max(...groupPrograms.map(p => p.maxGroupMembers || 0));
                                              return maxMembers > 0 ? maxMembers : 'N/A';
                                            })() : 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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

        {/* Activity & System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-2 text-blue-600" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">TechFest 2024 Approved</div>
                  <div className="text-sm text-gray-500">MIT College • {getTimeAgo(new Date().toISOString())}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">New College Registration</div>
                  <div className="text-sm text-gray-500">Design Institute • {getTimeAgo(new Date(Date.now() - 86400000).toISOString())}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Music Festival Rejected</div>
                  <div className="text-sm text-gray-500">Art College • {getTimeAgo(new Date(Date.now() - 172800000).toISOString())}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="bg-purple-100 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">System Performance Improved</div>
                  <div className="text-sm text-gray-500">Server optimization • {getTimeAgo(new Date(Date.now() - 259200000).toISOString())}</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-green-600" />
              System Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Server Status</span>
                </div>
                <span className="text-green-600 font-semibold">Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Database</span>
                </div>
                <span className="text-green-600 font-semibold">Connected</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Payment Gateway</span>
                </div>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Storage</span>
                </div>
                <span className="text-yellow-600 font-semibold">78% Used</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900">Response Time</span>
                </div>
                <span className="text-blue-600 font-semibold">45ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;