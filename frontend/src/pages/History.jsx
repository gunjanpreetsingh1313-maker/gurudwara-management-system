import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history').then((res) => setHistory(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!history) return null;

  return (
    <div>
      <PageHeader title="Gurudwara History" subtitle="Our heritage, mission, and journey" image="/images/gurudwara-day.jpg" />

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Establishment & Founder */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Establishment</h2>
            <p className="text-4xl font-bold text-saffron mb-2">{history.establishmentDate}</p>
            <p className="text-gray-600">Year of establishment</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-4">Founder</h2>
            <h3 className="text-xl font-semibold text-saffron">{history.founder?.name}</h3>
            <p className="text-gray-600 mt-2">{history.founder?.description}</p>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-navy mb-6">Our History</h2>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{history.history}</div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-navy text-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-saffron mb-4">Mission</h2>
            <p className="leading-relaxed">{history.mission}</p>
          </div>
          <div className="bg-saffron text-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Vision</h2>
            <p className="leading-relaxed">{history.vision}</p>
          </div>
        </div>

        {/* Timeline */}
        {history.timeline?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-8">Historical Timeline</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-saffron/30" />
              {history.timeline.map((item, i) => (
                <div key={i} className={`relative flex items-center mb-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'} pl-12 md:pl-0`}>
                    <div className="bg-cream rounded-xl p-5 inline-block">
                      <span className="text-saffron font-bold text-lg">{item.year}</span>
                      <h3 className="font-semibold text-navy mt-1">{item.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 w-5 h-5 bg-saffron rounded-full border-4 border-white shadow" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {history.photos?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Photo Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {history.photos.map((photo, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow group">
                  <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                  {photo.caption && <p className="p-2 text-sm text-gray-600 bg-cream">{photo.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {history.videos?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Videos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {history.videos.map((video, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow">
                  <div className="aspect-video bg-navy flex items-center justify-center">
                    <a href={video.url} target="_blank" rel="noreferrer" className="text-white hover:text-saffron">
                      {video.title || 'Watch Video'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
