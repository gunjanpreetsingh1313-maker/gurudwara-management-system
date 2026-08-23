import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';
import { FaBook, FaCalendarAlt, FaBullhorn, FaHandHoldingHeart, FaHistory, FaImages, FaUsers, FaPhone, FaChartPie } from 'react-icons/fa';

const navCards = [
  { to: '/history', icon: FaHistory, title: 'History', desc: 'Our heritage & timeline', color: 'bg-navy' },
  { to: '/events', icon: FaCalendarAlt, title: 'Events', desc: 'Upcoming programs', color: 'bg-saffron' },
  { to: '/gallery', icon: FaImages, title: 'Gallery', desc: 'Photos & videos', color: 'bg-navy-light' },
  { to: '/donate', icon: FaHandHoldingHeart, title: 'Donate', desc: 'Support our seva', color: 'bg-saffron-dark' },
  { to: '/finances', icon: FaChartPie, title: 'Finances', desc: 'Budget & transparency', color: 'bg-navy-light' },
  { to: '/committee', icon: FaUsers, title: 'Committee', desc: 'Management team', color: 'bg-navy' },
  { to: '/contact', icon: FaPhone, title: 'Contact', desc: 'Get in touch', color: 'bg-saffron' },
];

export default function Home() {
  const [hukamnama, setHukamnama] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/hukamnama'),
      api.get('/events?upcoming=true'),
      api.get('/announcements'),
    ]).then(([h, e, a]) => {
      setHukamnama(h.data);
      setEvents(e.data.slice(0, 3));
      setAnnouncements(a.data.slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
        <img src="/images/gurudwara-night.jpg" alt="Gurudwara" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to Gurudwara Guru Singh Sabha
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            A sacred sanctuary of peace, devotion, and selfless service. Join us in prayer, kirtan, and langar seva.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/donate" className="px-6 py-3 bg-saffron hover:bg-saffron-dark text-white rounded-lg font-medium transition-colors">
              Donate Now
            </Link>
            <Link to="/events" className="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-navy rounded-lg font-medium transition-colors">
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {navCards.map((card) => (
            <Link key={card.to} to={card.to} className={`${card.color} text-white p-5 rounded-xl shadow-lg hover:scale-105 transition-transform text-center`}>
              <card.icon className="text-3xl mx-auto mb-2" />
              <h3 className="font-semibold">{card.title}</h3>
              <p className="text-xs opacity-80 mt-1">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Hukamnama */}
      {hukamnama && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-saffron">
            <div className="flex items-center gap-3 mb-6">
              <FaBook className="text-saffron text-2xl" />
              <h2 className="text-2xl font-bold text-navy">Daily Hukamnama</h2>
            </div>
            <p className="text-2xl text-navy leading-relaxed mb-4 font-serif">{hukamnama.gurmukhi}</p>
            <p className="text-gray-600 italic mb-2">{hukamnama.translation}</p>
            {hukamnama.ang && <p className="text-sm text-saffron font-medium">{hukamnama.ang}</p>}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 pb-16 grid lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-saffron text-xl" />
              <h2 className="text-xl font-bold text-navy">Upcoming Events</h2>
            </div>
            <Link to="/events" className="text-saffron text-sm hover:underline">View All</Link>
          </div>
          {events.length === 0 ? (
            <p className="text-gray-500">No upcoming events</p>
          ) : (
            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev._id} className="flex gap-4 p-4 bg-cream rounded-xl">
                  <div className="bg-saffron text-white rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{new Date(ev.date).getDate()}</div>
                    <div className="text-xs">{new Date(ev.date).toLocaleString('en', { month: 'short' })}</div>
                  </div>
                  <div>
                    <span className="text-xs bg-navy/10 text-navy px-2 py-0.5 rounded">{ev.type}</span>
                    <h3 className="font-semibold text-navy mt-1">{ev.title}</h3>
                    <p className="text-sm text-gray-500">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Announcements */}
        <section className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaBullhorn className="text-saffron text-xl" />
              <h2 className="text-xl font-bold text-navy">Announcements</h2>
            </div>
          </div>
          {announcements.length === 0 ? (
            <p className="text-gray-500">No announcements</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div key={a._id} className="p-4 border border-gray-100 rounded-xl hover:border-saffron/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${a.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {a.priority}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(a.createdAt)}</span>
                  </div>
                  <h3 className="font-semibold text-navy">{a.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
