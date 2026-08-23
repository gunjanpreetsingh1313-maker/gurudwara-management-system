import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import {
  FaTachometerAlt, FaHistory, FaHandHoldingHeart, FaArrowUp, FaArrowDown,
  FaWallet, FaChartBar, FaFileAlt, FaCalendarAlt, FaImages, FaUsers,
  FaBullhorn, FaCog, FaSignOutAlt, FaBars, FaTimes, FaBook,
} from 'react-icons/fa';
import KhandaIcon from '../../components/KhandaIcon';

const menuItems = [
  { to: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
  { to: '/admin/history', icon: FaHistory, label: 'History' },
  { to: '/admin/donations', icon: FaHandHoldingHeart, label: 'Donations' },
  { to: '/admin/income', icon: FaArrowUp, label: 'Income' },
  { to: '/admin/expenses', icon: FaArrowDown, label: 'Expenses' },
  { to: '/admin/budget', icon: FaWallet, label: 'Budget' },
  { to: '/admin/financial', icon: FaChartBar, label: 'Financial Dashboard' },
  { to: '/admin/reports', icon: FaFileAlt, label: 'Reports' },
  { to: '/admin/events', icon: FaCalendarAlt, label: 'Events' },
  { to: '/admin/gallery', icon: FaImages, label: 'Gallery' },
  { to: '/admin/committee', icon: FaUsers, label: 'Committee' },
  { to: '/admin/announcements', icon: FaBullhorn, label: 'Announcements' },
  { to: '/admin/hukamnama', icon: FaBook, label: 'Hukamnama' },
  { to: '/admin/contact', icon: FaCog, label: 'Contact Settings' },
  { to: '/admin/users', icon: FaUsers, label: 'Users' },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-navy-light flex items-center gap-2">
          <KhandaIcon className="text-saffron" size={28} />
          <div>
            <h2 className="font-bold">Admin Panel</h2>
            <p className="text-xs text-gray-400">{user?.name}</p>
          </div>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.to ? 'bg-saffron text-white' : 'hover:bg-navy-light'
              }`}>
              <item.icon className="text-base" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-navy-light">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full hover:bg-red-600/20 text-red-300 transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-navy text-xl" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <Link to="/" className="text-sm text-saffron hover:underline">View Website →</Link>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
