import React from 'react';
import AddEventForm from '../components/Events/AddEventForm';
import { Link } from 'react-router-dom';

const CreateEvent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Add Event to Program</h1>
          <Link to="/create-fest" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">+ Create New Fest</Link>
        </div>
        <AddEventForm />
      </div>
    </div>
  );
};

export default CreateEvent;