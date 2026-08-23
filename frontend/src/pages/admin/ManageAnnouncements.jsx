import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function ManageAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/announcements?all=true').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/announcements', form);
      toast.success('Posted');
      setForm({ title: '', content: '', priority: 'medium' });
      setShowForm(false);
      load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/announcements/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Announcements</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg"><FaPlus /> New Announcement</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
          <textarea required placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg" rows={4} />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="px-3 py-2 border rounded-lg">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">Post</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {items.map((a) => (
          <div key={a._id} className="bg-white rounded-xl shadow p-5 flex justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${a.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{a.priority}</span>
                <span className="text-xs text-gray-400">{formatDate(a.createdAt)}</span>
              </div>
              <h3 className="font-bold text-navy">{a.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{a.content}</p>
            </div>
            <button onClick={() => handleDelete(a._id)} className="text-red-500 self-start"><FaTrash /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
