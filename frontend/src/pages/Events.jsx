import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    const url = filter === 'upcoming' ? '/events?upcoming=true' : '/events';
    api.get(url).then((res) => setEvents(res.data)).finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Events" subtitle="Programs, celebrations & seva" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex gap-3 mb-8">
          {['upcoming', 'all'].map((f) => (
            <button key={f} onClick={() => { setLoading(true); setFilter(f); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f ? 'bg-saffron text-white' : 'bg-white text-navy border'}`}>
              {f === 'upcoming' ? 'Upcoming' : 'All Events'}
            </button>
          ))}
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No events found</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div key={ev._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {ev.banner ? (
                  <img src={ev.banner} alt={ev.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                    <span className="text-saffron text-4xl font-bold">{ev.type?.[0]}</span>
                  </div>
                )}
                <div className="p-6">
                  <span className="text-xs bg-saffron/10 text-saffron-dark px-2 py-1 rounded font-medium">{ev.type}</span>
                  <h3 className="text-xl font-bold text-navy mt-2">{ev.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(ev.date)} {ev.time && `• ${ev.time}`}</p>
                  <p className="text-gray-600 mt-3 text-sm line-clamp-3">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
