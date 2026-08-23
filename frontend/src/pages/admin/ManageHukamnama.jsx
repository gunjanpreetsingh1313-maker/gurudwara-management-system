import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageHukamnama() {
  const [form, setForm] = useState({ gurmukhi: '', translation: '', ang: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/hukamnama', { ...form, date: new Date() });
      toast.success('Hukamnama updated for today');
      setForm({ gurmukhi: '', translation: '', ang: '' });
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Update Daily Hukamnama</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-2xl">
        <div>
          <label className="text-sm font-medium">Gurmukhi</label>
          <textarea required value={form.gurmukhi} onChange={(e) => setForm({ ...form, gurmukhi: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg font-serif text-lg" rows={4} />
        </div>
        <div>
          <label className="text-sm font-medium">Translation</label>
          <textarea required value={form.translation} onChange={(e) => setForm({ ...form, translation: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={3} />
        </div>
        <div>
          <label className="text-sm font-medium">Ang</label>
          <input value={form.ang} onChange={(e) => setForm({ ...form, ang: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="Ang 1" />
        </div>
        <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">Post Hukamnama</button>
      </form>
    </div>
  );
}
