import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function ManageHistory() {
  const [history, setHistory] = useState(null);
  const [timelineItem, setTimelineItem] = useState({ year: '', title: '', description: '' });

  useEffect(() => {
    api.get('/history').then((r) => setHistory(r.data));
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await api.put('/history', history);
      setHistory(data);
      toast.success('History updated');
    } catch { toast.error('Failed to save'); }
  };

  const addTimeline = () => {
    if (!timelineItem.year || !timelineItem.title) return;
    setHistory({ ...history, timeline: [...(history.timeline || []), timelineItem] });
    setTimelineItem({ year: '', title: '', description: '' });
  };

  const removeTimeline = (i) => {
    setHistory({ ...history, timeline: history.timeline.filter((_, idx) => idx !== i) });
  };

  if (!history) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage History</h1>
        <button onClick={handleSave} className="px-6 py-2 bg-saffron text-white rounded-lg">Save All Changes</button>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Establishment Date</label>
            <input value={history.establishmentDate || ''} onChange={(e) => setHistory({ ...history, establishmentDate: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="text-sm font-medium">Founder Name</label>
            <input value={history.founder?.name || ''} onChange={(e) => setHistory({ ...history, founder: { ...history.founder, name: e.target.value } })} className="w-full mt-1 px-3 py-2 border rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Founder Description</label>
            <textarea value={history.founder?.description || ''} onChange={(e) => setHistory({ ...history, founder: { ...history.founder, description: e.target.value } })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={2} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <label className="text-sm font-medium">History</label>
          <textarea value={history.history || ''} onChange={(e) => setHistory({ ...history, history: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={6} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <label className="text-sm font-medium">Mission</label>
            <textarea value={history.mission || ''} onChange={(e) => setHistory({ ...history, mission: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={4} />
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <label className="text-sm font-medium">Vision</label>
            <textarea value={history.vision || ''} onChange={(e) => setHistory({ ...history, vision: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={4} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-navy mb-4">Timeline</h3>
          <div className="grid md:grid-cols-4 gap-3 mb-4">
            <input placeholder="Year" value={timelineItem.year} onChange={(e) => setTimelineItem({ ...timelineItem, year: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Title" value={timelineItem.title} onChange={(e) => setTimelineItem({ ...timelineItem, title: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Description" value={timelineItem.description} onChange={(e) => setTimelineItem({ ...timelineItem, description: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <button onClick={addTimeline} className="px-4 py-2 bg-navy text-white rounded-lg flex items-center justify-center gap-2"><FaPlus /> Add</button>
          </div>
          {history.timeline?.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-cream rounded-lg mb-2">
              <div><span className="font-bold text-saffron">{item.year}</span> - <span className="font-medium">{item.title}</span><p className="text-sm text-gray-600">{item.description}</p></div>
              <button onClick={() => removeTimeline(i)} className="text-red-500"><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
