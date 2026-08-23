import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function ManageGallery() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'image', album: 'General', caption: '' });
  const [file, setFile] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/gallery?all=true').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('file', file);
      await api.post('/gallery', fd);
      toast.success('Uploaded');
      setShowForm(false); setFile(null); load();
    } catch { toast.error('Upload failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/gallery/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Gallery</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg"><FaPlus /> Upload</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-3 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border rounded-lg"><option value="image">Image</option><option value="video">Video</option></select>
          <input placeholder="Album" value={form.album} onChange={(e) => setForm({ ...form, album: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input placeholder="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="file" required onChange={(e) => setFile(e.target.files[0])} className="px-3 py-2 border rounded-lg" />
          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">Upload</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden group relative">
            <img src={item.url} alt={item.title} className="w-full aspect-square object-cover" />
            <div className="p-2 text-sm truncate">{item.caption || item.title || item.album}</div>
            <button onClick={() => handleDelete(item._id)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FaTrash size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
