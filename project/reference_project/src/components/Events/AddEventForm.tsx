import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AddEventForm: React.FC = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    programId: '',
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    seatLimit: '',
    ticketPrice: '',
    type: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const myPrograms = await apiService.getMyPrograms();
        setPrograms(myPrograms);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!formData.programId || !formData.title || !formData.date || !formData.seatLimit || !formData.ticketPrice || !formData.type || !formData.venue) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      seatLimit: parseInt(formData.seatLimit, 10),
      ticketPrice: parseFloat(formData.ticketPrice),
      type: formData.type
    };
    try {
      await apiService.createEventUnderProgram(Number(formData.programId), payload);
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
      <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-tight">Add Event to Program</h2>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={sectionClass}>
          <label className={labelClass}>Select Program <span className="text-red-500">*</span></label>
          <select name="programId" value={formData.programId} onChange={handleChange} required className={inputClass}>
            <option value="">Select Program</option>
            {programs.map(program => (
              <option key={program.id} value={program.id} disabled={program.approvalStatus === 'APPROVED'}>
                {program.title} {program.approvalStatus === 'APPROVED' ? '(Approved)' : '(Pending)'}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">You can only add events to programs that are not yet approved.</div>
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Event Title" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Date <span className="text-red-500">*</span></label>
          <input name="date" type="date" value={formData.date} onChange={handleChange} required className={inputClass} />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Time</label>
          <input name="time" value={formData.time} onChange={handleChange} className={inputClass} placeholder="e.g. 10:00 AM" />
        </div>
        <div className={sectionClass}>
          <label className={labelClass}>Venue <span className="text-red-500">*</span></label>
          <input name="venue" value={formData.venue} onChange={handleChange} required className={inputClass} placeholder="e.g. Main Hall" />
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
          <label className={labelClass}>Type <span className="text-red-500">*</span></label>
          <input name="type" value={formData.type} onChange={handleChange} required className={inputClass} placeholder="e.g. Workshop, Competition" />
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-all mt-6" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEventForm; 