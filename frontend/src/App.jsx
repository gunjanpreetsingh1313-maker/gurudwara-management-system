import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';

import Home from './pages/Home';
import History from './pages/History';
import Donate from './pages/Donate';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Committee from './pages/Committee';
import Contact from './pages/Contact';
import Finances from './pages/Finances';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHistory from './pages/admin/ManageHistory';
import ManageDonations from './pages/admin/ManageDonations';
import ManageIncome from './pages/admin/ManageIncome';
import ManageExpenses from './pages/admin/ManageExpenses';
import ManageBudget from './pages/admin/ManageBudget';
import FinancialDashboard from './pages/admin/FinancialDashboard';
import ManageReports from './pages/admin/ManageReports';
import ManageEvents from './pages/admin/ManageEvents';
import ManageGallery from './pages/admin/ManageGallery';
import ManageCommittee from './pages/admin/ManageCommittee';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageHukamnama from './pages/admin/ManageHukamnama';
import ManageContact from './pages/admin/ManageContact';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/donate" element={<Layout><Donate /></Layout>} />
          <Route path="/finances" element={<Layout><Finances /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/committee" element={<Layout><Committee /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/history" element={<ProtectedRoute><AdminLayout><ManageHistory /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/donations" element={<ProtectedRoute><AdminLayout><ManageDonations /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/income" element={<ProtectedRoute><AdminLayout><ManageIncome /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/expenses" element={<ProtectedRoute><AdminLayout><ManageExpenses /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/budget" element={<ProtectedRoute><AdminLayout><ManageBudget /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/financial" element={<ProtectedRoute><AdminLayout><FinancialDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><AdminLayout><ManageReports /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute><AdminLayout><ManageEvents /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminLayout><ManageGallery /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/committee" element={<ProtectedRoute><AdminLayout><ManageCommittee /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute><AdminLayout><ManageAnnouncements /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/hukamnama" element={<ProtectedRoute><AdminLayout><ManageHukamnama /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/contact" element={<ProtectedRoute><AdminLayout><ManageContact /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><ManageUsers /></AdminLayout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
