import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency, MONTHS } from '../../utils/helpers';
import { FaPlus } from 'react-icons/fa';

export default function ManageBudget() {
  const [budgets, setBudgets] = useState([]);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    month: new Date().getMonth() + 1, year: new Date().getFullYear(),
    totalBudget: '', expectedIncome: '', expectedExpenses: '', savingTarget: '',
  });
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get('/budget').then((r) => setBudgets(r.data));
    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();
    api.get(`/budget/${m}/${y}`).then((r) => setCurrent(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/budget', {
        ...form,
        totalBudget: Number(form.totalBudget),
        expectedIncome: Number(form.expectedIncome),
        expectedExpenses: Number(form.expectedExpenses),
        savingTarget: Number(form.savingTarget),
      });
      toast.success('Budget set');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-navy">Monthly Budget</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-saffron text-white rounded-lg">
          <FaPlus /> Set Budget
        </button>
      </div>

      {current && (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Budget', value: current.budget?.totalBudget, color: 'bg-navy' },
            { label: 'Total Income', value: current.totalIncome, color: 'bg-green-500' },
            { label: 'Total Expenses', value: current.totalExpenses, color: 'bg-red-500' },
            { label: 'Remaining Balance', value: current.remainingBalance, color: 'bg-blue-500' },
            { label: 'Savings', value: current.savings, color: 'bg-saffron' },
            { label: 'Deficit', value: current.deficit, color: 'bg-red-700' },
          ].map((c) => (
            <div key={c.label} className={`${c.color} text-white rounded-xl p-4`}>
              <p className="text-xs opacity-80">{c.label}</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(c.value || 0)}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6 grid md:grid-cols-3 gap-4">
          <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className="px-3 py-2 border rounded-lg">
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
          <input type="number" required placeholder="Total Budget" value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="Expected Income" value={form.expectedIncome} onChange={(e) => setForm({ ...form, expectedIncome: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="Expected Expenses" value={form.expectedExpenses} onChange={(e) => setForm({ ...form, expectedExpenses: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <input type="number" placeholder="Saving Target" value={form.savingTarget} onChange={(e) => setForm({ ...form, savingTarget: e.target.value })} className="px-3 py-2 border rounded-lg" />
          <div className="md:col-span-3 flex gap-2">
            <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">Save Budget</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Month</th><th className="p-3 text-left">Year</th>
              <th className="p-3 text-right">Budget</th><th className="p-3 text-right">Expected Income</th>
              <th className="p-3 text-right">Expected Expenses</th><th className="p-3 text-right">Saving Target</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b._id} className="border-b hover:bg-cream">
                <td className="p-3">{MONTHS[b.month - 1]}</td>
                <td className="p-3">{b.year}</td>
                <td className="p-3 text-right">{formatCurrency(b.totalBudget)}</td>
                <td className="p-3 text-right">{formatCurrency(b.expectedIncome)}</td>
                <td className="p-3 text-right">{formatCurrency(b.expectedExpenses)}</td>
                <td className="p-3 text-right">{formatCurrency(b.savingTarget)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
