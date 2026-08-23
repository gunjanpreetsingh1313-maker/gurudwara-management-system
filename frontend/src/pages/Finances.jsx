import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { FaHandHoldingHeart, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, MONTHS } from '../utils/helpers';

const COLORS = ['#FF9933', '#1B2A4A', '#2C3E6B', '#D4A017', '#4CAF50', '#E91E63', '#9C27B0', '#00BCD4'];

export default function Finances() {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/public/finances/summary'),
      api.get(`/public/finances/charts?year=${year}`),
      api.get(`/public/finances/budget/${month}/${year}`),
    ]).then(([s, c, b]) => {
      setSummary(s.data);
      setCharts(c.data);
      setBudgetData(b.data);
    }).finally(() => setLoading(false));
  }, [year, month]);

  if (loading) return <LoadingSpinner />;

  const summaryCards = [
    { label: 'Monthly Income', value: formatCurrency(summary?.monthIncome), color: 'text-green-600', bg: 'border-green-200' },
    { label: 'Monthly Expenses', value: formatCurrency(summary?.monthExpenses), color: 'text-red-600', bg: 'border-red-200' },
    { label: 'Current Balance', value: formatCurrency(summary?.balance), color: 'text-blue-600', bg: 'border-blue-200' },
    { label: 'Total Savings', value: formatCurrency(summary?.savings), color: 'text-saffron', bg: 'border-saffron/30' },
    { label: 'Total Donations', value: formatCurrency(summary?.totalDonations), color: 'text-navy', bg: 'border-navy/20' },
    { label: 'Budget Used', value: `${summary?.budgetUsedPercent || 0}%`, color: 'text-navy', bg: 'border-navy/20' },
  ];

  const budgetCards = budgetData ? [
    { label: 'Total Budget', value: budgetData.budget?.totalBudget, color: 'bg-navy' },
    { label: 'Actual Income', value: budgetData.totalIncome, color: 'bg-green-500' },
    { label: 'Actual Expenses', value: budgetData.totalExpenses, color: 'bg-red-500' },
    { label: 'Remaining Balance', value: budgetData.remainingBalance, color: 'bg-blue-500' },
    { label: 'Savings', value: budgetData.savings, color: 'bg-saffron' },
    { label: 'Budget Remaining', value: budgetData.remainingBudget, color: 'bg-navy-light' },
  ] : [];

  return (
    <div>
      <PageHeader
        title="Financial Transparency"
        subtitle="Income, expenses, donations & monthly budget overview"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-saffron/10 border border-saffron/30 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-navy text-sm">
            We believe in transparency. All figures below reflect confirmed income, expenses, and donations managed by the committee.
          </p>
          <Link to="/donate" className="flex items-center gap-2 px-5 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg font-medium whitespace-nowrap transition-colors">
            <FaHandHoldingHeart /> Donate Now
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-navy">Current Month Overview</h2>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {summaryCards.map((c) => (
            <div key={c.label} className={`bg-white rounded-xl shadow p-4 text-center border ${c.bg}`}>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className={`text-lg font-bold mt-1 ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-navy">Monthly Budget</h2>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none text-sm"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none text-sm"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {!budgetData?.budget ? (
            <p className="text-gray-500 bg-white rounded-xl shadow p-6 text-center">
              No budget has been set for {MONTHS[month - 1]} {year} yet.
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                {budgetCards.map((c) => (
                  <div key={c.label} className={`${c.color} text-white rounded-xl p-4`}>
                    <p className="text-xs opacity-80">{c.label}</p>
                    <p className="text-xl font-bold mt-1">{formatCurrency(c.value || 0)}</p>
                  </div>
                ))}
              </div>
              {budgetData.budget && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-xs text-gray-500">Expected Income</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{formatCurrency(budgetData.budget.expectedIncome)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-xs text-gray-500">Expected Expenses</p>
                    <p className="text-lg font-bold text-red-600 mt-1">{formatCurrency(budgetData.budget.expectedExpenses)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-4 text-center">
                    <p className="text-xs text-gray-500">Saving Target</p>
                    <p className="text-lg font-bold text-saffron mt-1">{formatCurrency(budgetData.budget.savingTarget)}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {summary?.donationCount > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-10 text-center">
            <p className="text-gray-500 text-sm">Confirmed Donations Received</p>
            <p className="text-3xl font-bold text-navy mt-1">{formatCurrency(summary.totalDonations)}</p>
            <p className="text-sm text-gray-400 mt-1">from {summary.donationCount} confirmed donation{summary.donationCount !== 1 ? 's' : ''}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-navy mb-4">Monthly Income ({year})</h3>
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
            <h3 className="font-bold text-navy mb-4">Monthly Expenses ({year})</h3>
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
            <h3 className="font-bold text-navy mb-4">Expenses by Category</h3>
            {charts.categoryExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No expense data for {year}</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.categoryExpenses}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {charts.categoryExpenses.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-navy mb-4">Income by Category</h3>
            {charts.categoryIncome.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No income data for {year}</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={charts.categoryIncome}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {charts.categoryIncome.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
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

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-navy mb-4">Monthly Savings</h3>
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

        {summary?.recentTransactions?.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-navy mb-4">Recent Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Type</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentTransactions.map((t, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-cream/50">
                      <td className="py-3 pr-4">{formatDate(t.date)}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {t.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                          {t.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{t.category}</td>
                      <td className={`py-3 text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
