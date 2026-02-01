import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import CollegeDashboard from '../components/Dashboard/CollegeDashboard';
import AdminDashboard from '../components/Dashboard/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'STUDENT':
        return <StudentDashboard />;
      case 'COLLEGE':
        return <CollegeDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Dashboard not available for your role</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;