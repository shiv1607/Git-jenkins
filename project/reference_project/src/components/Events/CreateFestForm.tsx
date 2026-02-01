import React, { useState } from 'react';
import apiService from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CreateProgramForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    seatLimit: '',
    ticketPrice: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!formData.title || !formData.date || !formData.seatLimit || !formData.ticketPrice || !formData.description) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    const payload = {
      ...formData,
      seatLimit: parseInt(formData.seatLimit, 10),
      ticketPrice: parseFloat(formData.ticketPrice)
    };
    try {
      await apiService.createProgramContainer(payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        'Failed to create program. Please check the details and try again.'
      );
      console.error('Error creating program:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
  const sectionClass = "mb-5";

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-2xl mt-10">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">Create New Program</h2>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={sectionClass}>
          <label className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Program Title" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Date <span className="text-red-500">*</span></label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} required className={inputClass} />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Seat Limit <span className="text-red-500">*</span></label>
          <input name="seatLimit" type="number" value={formData.seatLimit} onChange={handleChange} required className={inputClass} placeholder="e.g. 100" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Ticket Price (₹) <span className="text-red-500">*</span></label>
          <input name="ticketPrice" type="number" value={formData.ticketPrice} onChange={handleChange} required className={inputClass} placeholder="e.g. 500" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Image URL</label>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} placeholder="https://example.com/image.jpg" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Description <span className="text-red-500">*</span></label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className={inputClass + ' min-h-[100px]'} placeholder="Describe your program..." />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all mt-6" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Program'}
        </button>
      </form>
    </div>
  );
};

export default CreateProgramForm; 