import { useEffect, useState } from 'react';
import api from '../services/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Contact() {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  useEffect(() => {
    api.get('/contact').then((res) => setContact(res.data)).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact/feedback', form);
      toast.success('Thank you for your feedback!');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageHeader title="Contact Us" subtitle="We'd love to hear from you" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">Get in Touch</h2>
              <div className="space-y-4">
                {contact?.address && (
                  <div className="flex items-start gap-4">
                    <FaMapMarkerAlt className="text-saffron text-xl mt-1" />
                    <div>
                      <p className="font-medium text-navy">Address</p>
                      <p className="text-gray-600">{contact.address}</p>
                    </div>
                  </div>
                )}
                {contact?.phone && (
                  <div className="flex items-center gap-4">
                    <FaPhone className="text-saffron text-xl" />
                    <div>
                      <p className="font-medium text-navy">Phone</p>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                )}
                {contact?.email && (
                  <div className="flex items-center gap-4">
                    <FaEnvelope className="text-saffron text-xl" />
                    <div>
                      <p className="font-medium text-navy">Email</p>
                      <p className="text-gray-600">{contact.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {contact?.mapEmbedUrl && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <iframe src={contact.mapEmbedUrl} width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" title="Map" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Send Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-saffron outline-none" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-saffron hover:bg-saffron-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
