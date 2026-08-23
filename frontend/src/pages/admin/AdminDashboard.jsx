import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { FaArrowUp, FaArrowDown, FaWallet, FaPiggyBank, FaHandHoldingHeart, FaCalendarAlt } from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-navy mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={FaArrowUp} label="Today's Income" value={formatCurrency(stats.todayIncome)} color="bg-green-500" />
        <StatCard icon={FaArrowUp} label="This Month Income" value={formatCurrency(stats.monthIncome)} color="bg-green-600" />
        <StatCard icon={FaArrowDown} label="This Month Expenses" value={formatCurrency(stats.monthExpenses)} color="bg-red-500" />
        <StatCard icon={FaWallet} label="Remaining Budget" value={formatCurrency(stats.remainingBudget)} color="bg-blue-500" />
        <StatCard icon={FaPiggyBank} label="Savings" value={formatCurrency(stats.savings)} color="bg-saffron" />
        <StatCard icon={FaHandHoldingHeart} label="Total Donations" value={formatCurrency(stats.totalDonations)} color="bg-purple-500" />
        <StatCard icon={FaCalendarAlt} label="Budget Used" value={`${stats.budgetUsedPercent}%`} color="bg-navy" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-navy">Upcoming Events</h2>
            <Link to="/admin/events" className="text-saffron text-sm hover:underline">Manage</Link>
          </div>
          {stats.upcomingEvents?.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingEvents?.map((ev) => (
                <div key={ev._id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                  <div>
                    <p className="font-medium text-navy">{ev.title}</p>
                    <p className="text-xs text-gray-500">{ev.type}</p>
                  </div>
                  <span className="text-sm text-saffron">{formatDate(ev.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Transactions</h2>
          {stats.recentTransactions?.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent transactions</p>
          ) : (
            <div className="space-y-3">
              {stats.recentTransactions?.map((t) => (
                <div key={t._id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                  <div>
                    <p className="font-medium text-navy">{t.category}</p>
                    <p className="text-xs text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <span className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
