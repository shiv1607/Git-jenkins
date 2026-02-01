import React, { useState, useEffect } from 'react';

interface Fest {
  id: number;
  title: string;
  description: string;
  date: string;
  college?: { name: string };
  type?: string;
}

interface Props {
  fests: Fest[];
  onFilter: (filtered: Fest[]) => void;
}

export default function FestivalSearchBar({ fests, onFilter }: Props) {
  const [search, setSearch] = useState('');
  const [college, setCollege] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('');

  const colleges = Array.from(new Set(fests.map(f => f.college?.name).filter(Boolean)));
  const types = Array.from(new Set(fests.map(f => f.type).filter(Boolean)));

  useEffect(() => {
    let filtered = fests;
    if (search) filtered = filtered.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
    if (college) filtered = filtered.filter(f => f.college?.name === college);
    if (date) filtered = filtered.filter(f => f.date === date);
    if (type) filtered = filtered.filter(f => f.type === type);
    onFilter(filtered);
  }, [search, college, date, type, fests, onFilter]);

  return (
    <div className="bg-white/80 rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        placeholder="Search by festival name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="flex-1 border-2 border-blue-100 focus:border-blue-400 p-3 rounded-xl transition-all duration-200 text-gray-900 bg-blue-50/30"
      />
      <select
        value={college}
        onChange={e => setCollege(e.target.value)}
        className="border-2 border-blue-100 p-3 rounded-xl bg-blue-50/30"
      >
        <option value="">All Colleges</option>
        {colleges.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border-2 border-blue-100 p-3 rounded-xl bg-blue-50/30"
      />
      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="border-2 border-blue-100 p-3 rounded-xl bg-blue-50/30"
      >
        <option value="">All Types</option>
        {types.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  );
}
