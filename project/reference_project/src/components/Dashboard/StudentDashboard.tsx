import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';

const StudentDashboard: React.FC = () => {
  const { programs, fetchPrograms, loading } = useApp();
  const [approvedPrograms, setApprovedPrograms] = useState<any[]>([]);

  useEffect(() => {
    fetchPrograms && fetchPrograms();
  }, []);

  useEffect(() => {
    setApprovedPrograms(
      (programs || []).filter(
        (program: any) =>
          program.fest && (program.fest.approvalStatus === 'APPROVED' || program.fest.approved)
      )
    );
  }, [programs]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
      <h3 className="text-xl font-semibold mb-4">Available Events</h3>
      {loading ? (
        <div>Loading...</div>
      ) : approvedPrograms.length === 0 ? (
        <div>No available events under approved programs.</div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Event</th>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Seats</th>
              <th className="p-3 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {approvedPrograms.map(program => (
              <tr key={program.id} className="border-b">
                <td className="p-3">{program.title}</td>
                <td className="p-3">{program.fest?.name}</td>
                <td className="p-3">{program.date}</td>
                <td className="p-3">{program.seatLimit}</td>
                <td className="p-3">₹{program.ticketPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentDashboard;