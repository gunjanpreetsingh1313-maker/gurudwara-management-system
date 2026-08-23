import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/committee').then((res) => setMembers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Committee Members" subtitle="Our management team" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {members.length === 0 ? (
          <p className="text-center text-gray-500">No committee members listed</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((m) => (
              <div key={m._id} className="bg-white rounded-2xl shadow-lg overflow-hidden text-center hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-navy to-navy-light flex items-center justify-center">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 bg-saffron rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {m.name?.[0]}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-navy">{m.name}</h3>
                  <p className="text-saffron font-medium text-sm mt-1">{m.position}</p>
                  {m.duration && <p className="text-xs text-gray-400 mt-1">Term: {m.duration}</p>}
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {m.contact && <p className="flex items-center justify-center gap-2"><FaPhone className="text-saffron" /> {m.contact}</p>}
                    {m.email && <p className="flex items-center justify-center gap-2"><FaEnvelope className="text-saffron" /> {m.email}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
