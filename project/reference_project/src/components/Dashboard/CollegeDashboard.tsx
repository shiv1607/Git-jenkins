import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, DollarSign, Clock, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';

const CollegeDashboard: React.FC = () => {
  const { programs, fetchPrograms, loading } = useApp();
  const [myPrograms, setMyPrograms] = useState<any[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programs = await apiService.getMyPrograms();
        setMyPrograms(programs);
      } catch {
        setMyPrograms([]);
      }
    };
    fetchPrograms();
    fetchPrograms && fetchPrograms();
  }, []);

  const handleDeleteProgram = async (programId: number) => {
    if (!window.confirm('Are you sure you want to delete this program?')) {
      return;
    }
    try {
      await apiService.deleteProgram(programId);
      const programs = await apiService.getMyPrograms();
      setMyPrograms(programs);
      fetchPrograms && fetchPrograms();
    } catch (err) {
      setError('Failed to delete program');
    }
  };

  // Calculate stats from real data
  const totalPrograms = programs.length;
  const totalEvents = myPrograms ? myPrograms.length : 0;
  const activePrograms = programs.filter(p => p.seatLimit > 0).length;
  const totalRevenue = programs.reduce((sum, p) => sum + (p.ticketPrice || 0), 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">College Dashboard</h2>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg flex items-center gap-3"><Calendar /> Total Programs: {totalEvents}</div>
        <div className="bg-green-100 p-4 rounded-lg flex items-center gap-3"><Users /> Total Programs: {totalPrograms}</div>
        <div className="bg-purple-100 p-4 rounded-lg flex items-center gap-3"><DollarSign /> Revenue: ₹{totalRevenue}</div>
        <div className="bg-orange-100 p-4 rounded-lg flex items-center gap-3"><Clock /> Active Programs: {activePrograms}</div>
      </div>
      <button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2" onClick={() => navigate('/create-program')}><Plus /> Create New Program</button>
      <h3 className="text-xl font-semibold mb-2">Your Programs</h3>
      {loading ? (
        <div>Loading...</div>
      ) : programs.length === 0 ? (
        <div>No programs found.</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(program => (
              <tr key={program.id} className="border-b">
                <td className="p-3">{program.title}</td>
                <td className="p-3">{program.date}</td>
                <td className="p-3">{program.seatLimit}</td>
                <td className="p-3">₹{program.ticketPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 className="text-xl font-semibold mt-8 mb-2">Your Programs</h3>
      {/* Existing fest management UI can go here */}
      {myPrograms.length === 0 ? (
        <div>No programs found.</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myPrograms.map(program => (
              <tr key={program.id} className="border-b">
                <td className="p-3">{program.title}</td>
                <td className="p-3">{program.date}</td>
                <td className="p-3">{program.seatLimit}</td>
                <td className="p-3">₹{program.ticketPrice}</td>
                <td className="p-3">
                  <button onClick={() => handleDeleteProgram(program.id)} className="text-red-600 hover:text-red-800 text-sm font-medium" title="Delete Program">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CollegeDashboard;