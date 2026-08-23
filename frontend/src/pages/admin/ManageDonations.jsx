import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FaTrash } from 'react-icons/fa';

export default function ManageDonations() {
  const [items, setItems] = useState([]);
  const load = () => api.get('/donations').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/donations/${id}`, { status });
    toast.success('Status updated');
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/donations/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Manage Donations</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Date</th><th className="p-3 text-left">Donor</th><th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Amount</th><th className="p-3 text-left">Mode</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b hover:bg-cream">
                <td className="p-3">{formatDate(item.date)}</td>
                <td className="p-3">{item.donorName || 'Anonymous'}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3 text-right font-medium text-green-600">{formatCurrency(item.amount)}</td>
                <td className="p-3">{item.paymentMode}</td>
                <td className="p-3">
                  <select value={item.status} onChange={(e) => updateStatus(item._id, e.target.value)} className="text-xs border rounded px-2 py-1">
                    {['pending', 'confirmed', 'rejected'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => handleDelete(item._id)} className="text-red-500"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
