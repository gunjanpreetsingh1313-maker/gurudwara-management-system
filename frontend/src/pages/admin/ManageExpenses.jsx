import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, EXPENSE_CATEGORIES } from '../../utils/helpers';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const empty = { amount: '', date: new Date().toISOString().split('T')[0], category: 'Langar', vendor: '', description: '' };

export default function ManageExpenses() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [bill, setBill] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/expenses').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.set('amount', form.amount);
      if (bill) fd.append('bill', bill);
      if (editing) {
        await api.put(`/expenses/${editing}`, fd);
        toast.success('Expense updated');
      } else {
        await api.post('/expenses', fd);
        toast.success('Expense added');
      }
      setForm(empty); setBill(null); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed to save'); }
  };

  const handleEdit = (item) => {
    setForm({ amount: item.amount, date: item.date.split('T')[0], category: item.category, vendor: item.vendor || '', description: item.description || '' });
    setEditing(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    await api.delete(`/expenses/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Manage Expenses</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg">
          <FaPlus /> Add Expense
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-3 gap-4">
          <input type="number" required placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg">
            {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Vendor" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="file" onChange={(e) => setBill(e.target.files[0])} className="px-3 py-2 border rounded-lg" accept="image/*,.pdf" />
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
              <th className="p-3 text-left">Date</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Vendor</th>
              <th className="p-3 text-right">Amount</th><th className="p-3 text-left">Bill</th><th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b hover:bg-cream">
                <td className="p-3">{formatDate(item.date)}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.vendor || '-'}</td>
                <td className="p-3 text-right font-medium text-red-600">{formatCurrency(item.amount)}</td>
                <td className="p-3">{item.billUpload ? <a href={item.billUpload} target="_blank" rel="noreferrer" className="text-saffron hover:underline">View</a> : '-'}</td>
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
