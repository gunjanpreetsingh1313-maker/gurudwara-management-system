import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const empty = { name: '', position: '', contact: '', email: '', duration: '', order: 0 };

export default function ManageCommittee() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/committee').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      if (editing) { await api.put(`/committee/${editing}`, fd); toast.success('Updated'); }
      else { await api.post('/committee', fd); toast.success('Added'); }
      setForm(empty); setPhoto(null); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/committee/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Committee</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg"><FaPlus /> Add Member</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-3 gap-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input required placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="px-3 py-2 border rounded-lg" />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">{editing ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m._id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            {m.photo ? <img src={m.photo} alt="" className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 bg-saffron rounded-full flex items-center justify-center text-white font-bold text-xl">{m.name[0]}</div>}
            <div className="flex-1">
              <h3 className="font-bold text-navy">{m.name}</h3>
              <p className="text-sm text-saffron">{m.position}</p>
              <p className="text-xs text-gray-500">{m.duration}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => { setForm({ name: m.name, position: m.position, contact: m.contact || '', email: m.email || '', duration: m.duration || '', order: m.order }); setEditing(m._id); setShowForm(true); }} className="text-blue-500"><FaEdit /></button>
              <button onClick={() => handleDelete(m._id)} className="text-red-500"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
