import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, INCOME_CATEGORIES, PAYMENT_MODES } from '../../utils/helpers';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const empty = { amount: '', date: new Date().toISOString().split('T')[0], category: 'Donations', donorName: '', paymentMode: 'Cash', description: '' };

export default function ManageIncome() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/income').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, amount: Number(form.amount) };
      if (editing) {
        await api.put(`/income/${editing}`, data);
        toast.success('Income updated');
      } else {
        await api.post('/income', data);
        toast.success('Income added');
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    setForm({ ...item, date: item.date.split('T')[0] });
    setEditing(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    await api.delete(`/income/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Income</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg">
          <FaPlus /> Add Income
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-3 gap-4">
          <input type="number" required placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg">
            {INCOME_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Donor Name" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} className="px-3 py-2 border rounded-lg">
            {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">{editing ? 'Update' : 'Save'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Date</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Donor</th>
              <th className="p-3 text-right">Amount</th><th className="p-3 text-left">Mode</th><th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b hover:bg-cream">
                <td className="p-3">{formatDate(item.date)}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.donorName || '-'}</td>
                <td className="p-3 text-right font-medium text-green-600">{formatCurrency(item.amount)}</td>
                <td className="p-3">{item.paymentMode}</td>
                <td className="p-3 text-center">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 mx-1"><FaEdit /></button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 mx-1"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
