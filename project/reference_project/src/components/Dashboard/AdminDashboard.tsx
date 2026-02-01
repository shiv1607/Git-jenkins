import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [pendingFests, setPendingFests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingFests = async () => {
      setLoading(true);
      try {
        const fests = await apiService.getPendingFests();
        setPendingFests(fests);
      } catch (err) {
        setError('Failed to fetch pending fests.');
      } finally {
        setLoading(false);
      }
    };
    fetchPendingFests();
  }, []);

  const handleApprove = async (festId: number) => {
    try {
      await apiService.approveFest(festId);
      setPendingFests(pendingFests.filter(fest => fest.id !== festId));
    } catch (err) {
      setError('Failed to approve fest.');
    }
  };

  const handleReject = async (festId: number) => {
    try {
      await apiService.rejectFest(festId);
      setPendingFests(pendingFests.filter(fest => fest.id !== festId));
    } catch (err) {
      setError('Failed to reject fest.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h3 className="text-xl font-semibold mb-4">Pending Programs for Approval</h3>
      {loading ? (
        <div>Loading...</div>
      ) : pendingFests.length === 0 ? (
        <div>No pending programs.</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">College</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingFests.map(fest => (
              <tr key={fest.id} className="border-b">
                <td className="p-3">{fest.title}</td>
                <td className="p-3">{fest.date}</td>
                <td className="p-3">{fest.college?.name}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleApprove(fest.id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Approve</button>
                  <button onClick={() => handleReject(fest.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;