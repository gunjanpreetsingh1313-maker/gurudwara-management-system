import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/gallery'), api.get('/gallery/albums')]).then(([g, a]) => {
      setItems(g.data);
      setAlbums(a.data);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    if (activeAlbum !== 'all' && item.album !== activeAlbum) return false;
    if (activeType !== 'all' && item.type !== activeType) return false;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Gallery" subtitle="Photos, videos & memories" image="/images/gurudwara-day.jpg" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => setActiveType('all')} className={`px-4 py-2 rounded-lg text-sm ${activeType === 'all' ? 'bg-saffron text-white' : 'bg-white border'}`}>All</button>
          <button onClick={() => setActiveType('image')} className={`px-4 py-2 rounded-lg text-sm ${activeType === 'image' ? 'bg-saffron text-white' : 'bg-white border'}`}>Images</button>
          <button onClick={() => setActiveType('video')} className={`px-4 py-2 rounded-lg text-sm ${activeType === 'video' ? 'bg-saffron text-white' : 'bg-white border'}`}>Videos</button>
          <span className="border-l mx-2" />
          <button onClick={() => setActiveAlbum('all')} className={`px-4 py-2 rounded-lg text-sm ${activeAlbum === 'all' ? 'bg-navy text-white' : 'bg-white border'}`}>All Albums</button>
          {albums.map((a) => (
            <button key={a} onClick={() => setActiveAlbum(a)} className={`px-4 py-2 rounded-lg text-sm ${activeAlbum === a ? 'bg-navy text-white' : 'bg-white border'}`}>{a}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No gallery items yet</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <img src="/images/gurudwara-night.jpg" alt="Gurudwara at night" className="rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightbox('/images/gurudwara-night.jpg')} />
              <img src="/images/gurudwara-day.jpg" alt="Gurudwara" className="rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform" onClick={() => setLightbox('/images/gurudwara-day.jpg')} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={item._id} className="rounded-xl overflow-hidden shadow-lg cursor-pointer group" onClick={() => setLightbox(item.url)}>
                {item.type === 'video' ? (
                  <div className="aspect-square bg-navy flex items-center justify-center text-white">
                    <span className="text-4xl">▶</span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.caption || item.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                )}
                {(item.caption || item.title) && (
                  <p className="p-2 text-sm bg-white truncate">{item.caption || item.title}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-lg" />
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightbox(null)}>&times;</button>
        </div>
      )}
    </div>
  );
}
