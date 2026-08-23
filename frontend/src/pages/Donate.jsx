import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { formatDate } from '../utils/helpers';
import { FaUniversity, FaQrcode, FaMobileAlt } from 'react-icons/fa';

export default function Donate() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    amount: '', donorName: '', donorEmail: '', donorPhone: '',
    paymentMode: 'UPI', category: 'General', description: '',
  });

  useEffect(() => {
    api.get('/contact').then((res) => setContact(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/donations', { ...form, amount: Number(form.amount) });
      toast.success('Donation submitted successfully! Thank you for your seva.');
      setForm({ amount: '', donorName: '', donorEmail: '', donorPhone: '', paymentMode: 'UPI', category: 'General', description: '' });
    } catch {
      toast.error('Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Donate" subtitle="Support our Gurudwara seva" image="/images/gurudwara-night.jpg" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Submit Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
                <input type="number" required min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron focus:border-saffron outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.donorPhone} onChange={(e) => setForm({ ...form, donorPhone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={form.donorEmail} onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none">
                    {['General', 'Dasvandh', 'Langar Donation', 'Online Donation', 'Cash Donation', 'Bank Transfer'].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                  <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none">
                    {['Cash', 'UPI', 'Bank Transfer', 'Online', 'Cheque'].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-saffron hover:bg-saffron-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Donation'}
              </button>
            </form>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">Donation Methods</h2>
              <p className="text-gray-600 mb-6">{contact?.donationMethods}</p>

              {contact?.upiId && (
                <div className="flex items-center gap-4 p-4 bg-cream rounded-xl mb-4">
                  <FaMobileAlt className="text-saffron text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">UPI ID</p>
                    <p className="font-semibold text-navy">{contact.upiId}</p>
                  </div>
                </div>
              )}

              {contact?.bankName && (
                <div className="flex items-center gap-4 p-4 bg-cream rounded-xl mb-4">
                  <FaUniversity className="text-saffron text-2xl" />
                  <div>
                    <p className="text-sm text-gray-500">Bank Details</p>
                    <p className="font-semibold text-navy">{contact.bankName}</p>
                    <p className="text-sm">A/C: {contact.accountNumber}</p>
                    <p className="text-sm">IFSC: {contact.ifscCode}</p>
                  </div>
                </div>
              )}

              {contact?.qrCodeImage && (
                <div className="text-center p-4 bg-cream rounded-xl">
                  <FaQrcode className="text-saffron text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">Scan QR Code</p>
                  <img src={contact.qrCodeImage} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
