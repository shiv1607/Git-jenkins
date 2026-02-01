import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface Program {
  id: number;
  title: string;
  description: string;
  date: string;
  seatLimit: number;
  ticketPrice: number;
  imageUrl: string;
  college: {
    id: number;
    name: string;
  };
  approvalStatus?: string;
  createdAt?: string;
  approved?: boolean;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  seatLimit: number;
  ticketPrice: number;
  imageUrl: string;
  category?: string;
  subCategory?: string;
  tags?: string;
  program: {
    id: number;
    name: string;
  };
}

interface AppContextType {
  programs: Program[];
  fetchPrograms: () => Promise<void>;
  events: Event[];
  fetchEvents: () => Promise<void>;
  loading: boolean;
  // ...other context values
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await apiService.getFests();
      setPrograms(data);
    } catch (err) {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const programsData = await apiService.getFests();
      let allEvents: Event[] = [];
      for (const program of programsData) {
        const programEvents = await apiService.getProgramsByFestId(program.id);
        allEvents = allEvents.concat(
          (programEvents || []).map((event: any) => ({ ...event, program: { id: program.id, name: program.title } }))
        );
      }
      setEvents(allEvents);
    } catch (err) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchEvents();
  }, []);

  return (
    <AppContext.Provider value={{ programs, fetchPrograms, events, fetchEvents, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);