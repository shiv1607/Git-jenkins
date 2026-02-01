import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const categories = [
  'TECHNICAL', 'MUSICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'OTHER'
];

const CreateEventForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    programId: '',
    title: '',
    description: '',
    date: '',
    seatLimit: '',
    ticketPrice: '',
    imageUrl: '',
    category: '',
    subCategory: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch college's own programs for selection
    const fetchPrograms = async () => {
      try {
        const myPrograms = await apiService.getMyPrograms();
        // Only show approved programs
        setPrograms((myPrograms || []).filter((program: any) => program.approvalStatus === 'APPROVED' || program.approved));
      } catch (err) {
        setPrograms([]);
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation for required fields
    if (!formData.programId) {
      setError('Please select an approved program to add this event to.');
      setLoading(false);
      return;
    }
    if (!formData.title || !formData.date || !formData.seatLimit || !formData.ticketPrice || !formData.category || !formData.description) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Create a new payload with correct data types
    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      seatLimit: parseInt(formData.seatLimit, 10),
      ticketPrice: parseFloat(formData.ticketPrice),
      imageUrl: formData.imageUrl,
      category: formData.category,
      subCategory: formData.subCategory,
      tags: formData.tags
    };

    try {
      await apiService.createEvent(Number(formData.programId), payload);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data ||
        'Failed to create event. Please check the details and try again.'
      );
      console.error('Error creating event:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 placeholder-gray-400";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";
  const sectionClass = "mb-5";

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-2xl mt-10">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">Create New Event</h2>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</div>}
      {programs.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-700 mb-4">No approved programs found. You must create a program and wait for admin approval before adding events.</p>
          <a href="/create-program" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold">+ Create New Program</a>
        </div>
      ) : (
      <form onSubmit={step === 2 ? handleSubmit : handleNext}>
        {step === 1 && (
          <>
            <div className={sectionClass}>
              <label className={labelClass}>Select Program <span className="text-red-500">*</span></label>
              <select name="programId" value={formData.programId} onChange={handleChange} required className={inputClass}>
                <option value="">Select Program</option>
                {programs.map(program => <option key={program.id} value={program.id}>{program.title}</option>)}
              </select>
              <div className="text-xs text-gray-500 mt-1">Only approved programs are shown here. Create and get your program approved to add events.</div>
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Event Title" />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} required className={inputClass} />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Seat Limit</label>
              <input name="seatLimit" type="number" value={formData.seatLimit} onChange={handleChange} required className={inputClass} placeholder="e.g. 100" />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Ticket Price (₹)</label>
              <input name="ticketPrice" type="number" value={formData.ticketPrice} onChange={handleChange} required className={inputClass} placeholder="e.g. 500" />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Image URL</label>
              <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputClass} placeholder="https://example.com/image.jpg" />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all mt-6">Next</button>
          </>
        )}
        {step === 2 && (
          <>
            <div className={sectionClass}>
              <label className={labelClass}>Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Subcategory</label>
              <input name="subCategory" value={formData.subCategory} onChange={handleChange} className={inputClass} placeholder="e.g. AI, Dance" />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Tags (comma separated)</label>
              <input name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="e.g. AI,ML,Robotics" />
            </div>
            <div className={sectionClass}>
              <label className={labelClass}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required className={inputClass + ' min-h-[100px]'} placeholder="Describe your event..." />
            </div>
            <div className="flex justify-between mt-8 gap-4">
              <button type="button" onClick={handleBack} className="w-1/2 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg shadow hover:bg-gray-300 transition-all">Back</button>
              <button type="submit" className="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </form>
      )}
    </div>
  );
};

export default CreateEventForm;