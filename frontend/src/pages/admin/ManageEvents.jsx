import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatDate, EVENT_TYPES } from '../../utils/helpers';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const empty = { title: '', type: 'Gurpurab', date: '', time: '', description: '' };

export default function ManageEvents() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [banner, setBanner] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/events').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (banner) fd.append('banner', banner);
      if (editing) { await api.put(`/events/${editing}`, fd); toast.success('Updated'); }
      else { await api.post('/events', fd); toast.success('Created'); }
      setForm(empty); setBanner(null); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/events/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Events</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg"><FaPlus /> Add Event</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-2 gap-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border rounded-lg">{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input placeholder="Time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="md:col-span-2 px-3 py-2 border rounded-lg" rows={3} />
          <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} className="px-3 py-2 border rounded-lg" />
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">{editing ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((ev) => (
          <div key={ev._id} className="bg-white rounded-xl shadow overflow-hidden">
            {ev.banner && <img src={ev.banner} alt="" className="w-full h-32 object-cover" />}
            <div className="p-4">
              <span className="text-xs bg-saffron/10 text-saffron px-2 py-0.5 rounded">{ev.type}</span>
              <h3 className="font-bold text-navy mt-1">{ev.title}</h3>
              <p className="text-sm text-gray-500">{formatDate(ev.date)} {ev.time}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setForm({ title: ev.title, type: ev.type, date: ev.date.split('T')[0], time: ev.time || '', description: ev.description || '' }); setEditing(ev._id); setShowForm(true); }} className="text-blue-500"><FaEdit /></button>
                <button onClick={() => handleDelete(ev._id)} className="text-red-500"><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
