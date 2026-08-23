import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const COLORS = ['#FF9933', '#1B2A4A', '#2C3E6B', '#D4A017', '#4CAF50', '#E91E63', '#9C27B0', '#00BCD4'];

export default function FinancialDashboard() {
  const [charts, setCharts] = useState(null);
  const [stats, setStats] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/dashboard/charts?year=${year}`),
      api.get('/dashboard/stats'),
    ]).then(([c, s]) => {
      setCharts(c.data);
      setStats(s.data);
    }).finally(() => setLoading(false));
  }, [year]);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Income', value: formatCurrency(stats?.monthIncome), color: 'text-green-600' },
    { label: 'Total Expenses', value: formatCurrency(stats?.monthExpenses), color: 'text-red-600' },
    { label: 'Current Balance', value: formatCurrency((stats?.monthIncome || 0) - (stats?.monthExpenses || 0)), color: 'text-blue-600' },
    { label: 'Total Savings', value: formatCurrency(stats?.savings), color: 'text-saffron' },
    { label: 'Budget Used', value: `${stats?.budgetUsedPercent}%`, color: 'text-navy' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-navy">Financial Dashboard</h1>
        <select value={year} onChange={(e) => { setLoading(true); setYear(Number(e.target.value)); }}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none">
          {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl shadow p-4 text-center">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className={`text-lg font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-navy mb-4">Monthly Income</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#FF9933" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-navy mb-4">Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.monthlyExpense}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#1B2A4A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-navy mb-4">Category-wise Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={charts.categoryExpenses} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={100} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}>
                {charts.categoryExpenses.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-bold text-navy mb-4">Yearly Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.yearlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" fill="#FF9933" name="Income" />
              <Bar dataKey="expense" fill="#1B2A4A" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-bold text-navy mb-4">Savings Graph</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={charts.savingsGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Line type="monotone" dataKey="savings" stroke="#4CAF50" strokeWidth={2} dot={{ fill: '#4CAF50' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
