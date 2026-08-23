import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageContact() {
  const [form, setForm] = useState({});
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    api.get('/contact').then((r) => setForm(r.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      ['address', 'phone', 'email', 'mapEmbedUrl', 'bankName', 'accountNumber', 'ifscCode', 'upiId', 'donationMethods'].forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });
      if (qrCode) fd.append('qrCode', qrCode);
      const { data } = await api.put('/contact', fd);
      setForm(data);
      toast.success('Contact settings updated');
    } catch { toast.error('Failed to save'); }
  };

  const fields = [
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'mapEmbedUrl', label: 'Google Maps Embed URL' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'accountNumber', label: 'Account Number' },
    { key: 'ifscCode', label: 'IFSC Code' },
    { key: 'upiId', label: 'UPI ID' },
    { key: 'donationMethods', label: 'Donation Methods Info', type: 'textarea' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Contact Settings</h1>
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow p-6 space-y-4 max-w-2xl">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-sm font-medium">{f.label}</label>
            {f.type === 'textarea' ? (
              <textarea value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" rows={3} />
            ) : (
              <input value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg" />
            )}
          </div>
        ))}
        <div>
          <label className="text-sm font-medium">QR Code Image</label>
          <input type="file" accept="image/*" onChange={(e) => setQrCode(e.target.files[0])} className="w-full mt-1 px-3 py-2 border rounded-lg" />
          {form.qrCodeImage && <img src={form.qrCodeImage} alt="QR" className="w-32 h-32 mt-2 rounded" />}
        </div>
        <button type="submit" className="px-6 py-2 bg-saffron text-white rounded-lg">Save Settings</button>
      </form>
    </div>
  );
}
