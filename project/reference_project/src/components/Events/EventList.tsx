import React, { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import EventCard from './EventCard';
import { Loader2, Search, Filter } from 'lucide-react';
import apiService from '../../services/api';

const categories = ['ALL', 'TECHNICAL', 'MUSICAL', 'CULTURAL', 'SPORTS', 'WORKSHOP', 'OTHER'];
const priceRanges = ['Any', 'Free', '0-500', '500-1000', '1000+'];

const EventList: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPrice, setSelectedPrice] = useState('Any');

  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      try {
        const fests = await apiService.getFests();
        let allEvents: any[] = [];
        for (const fest of fests) {
          const festPrograms = await apiService.getProgramsByFestId(fest.id);
          // Attach fest info to each program
          allEvents = allEvents.concat(
            (festPrograms || []).map((event: any) => ({ ...event, fest: { id: fest.id, name: fest.title } }))
          );
        }
        setEvents(allEvents);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  // Filtering logic
  const filteredEvents = events.filter((event: any) => {
    let matches = true;
    if (searchTerm.trim() !== '') {
      matches = matches && event.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedCategory !== 'ALL') {
      matches = matches && event.category === selectedCategory;
    }
    if (selectedPrice !== 'Any') {
      if (selectedPrice === 'Free') {
        matches = matches && event.ticketPrice === 0;
      } else if (selectedPrice === '1000+') {
        matches = matches && event.ticketPrice > 1000;
      } else {
        const [min, max] = selectedPrice.split('-').map(parseFloat);
        matches = matches && event.ticketPrice >= min && event.ticketPrice <= max;
      }
    }
    return matches;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-lg">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and Filter bar for Events */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>)}
            </select>
            <select 
              value={selectedPrice} 
              onChange={e => setSelectedPrice(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priceRanges.map(price => <option key={price} value={price}>{price === 'Any' ? 'All Prices' : (price === 'Free' ? 'Free' : `₹${price}`)}</option>)}
            </select>
            <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
          <Search className="w-16 h-16 mx-auto text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700 mt-4">No Events Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default EventList;