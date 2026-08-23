import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';
import { FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';

export default function ManageReports() {
  const [type, setType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ type, format: 'json' });
      if (type === 'custom') { params.set('startDate', startDate); params.set('endDate', endDate); }
      const { data } = await api.get(`/reports?${params}`);
      setReport(data);
    } catch { toast.error('Failed to generate report'); }
    finally { setLoading(false); }
  };

  const handleExport = async (format) => {
    try {
      const params = new URLSearchParams({ type, format });
      if (type === 'custom') { params.set('startDate', startDate); params.set('endDate', endDate); }
      const response = await api.get(`/reports?${params}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${type}.${format === 'excel' ? 'xlsx' : format}`;
      link.click();
    } catch { toast.error('Export failed'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Reports</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border rounded-lg">
            {['daily', 'weekly', 'monthly', 'yearly', 'custom'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          {type === 'custom' && (
            <>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 border rounded-lg" />
            </>
          )}
          <button onClick={generate} disabled={loading} className="px-6 py-2 bg-saffron text-white rounded-lg disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm"><FaFilePdf /> PDF</button>
          <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"><FaFileExcel /> Excel</button>
          <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"><FaFileCsv /> CSV</button>
        </div>
      </div>

      {report && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Total Income', value: report.summary.totalIncome, color: 'text-green-600' },
              { label: 'Total Expenses', value: report.summary.totalExpenses, color: 'text-red-600' },
              { label: 'Balance', value: report.summary.balance, color: 'text-blue-600' },
              { label: 'Donations', value: report.summary.totalDonations, color: 'text-purple-600' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{formatCurrency(s.value)}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-navy mb-4">Income ({report.incomes.length})</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {report.incomes.map((i) => (
                  <div key={i._id} className="flex justify-between text-sm p-2 bg-cream rounded">
                    <span>{i.category}</span>
                    <span className="text-green-600 font-medium">{formatCurrency(i.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-navy mb-4">Expenses ({report.expenses.length})</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {report.expenses.map((e) => (
                  <div key={e._id} className="flex justify-between text-sm p-2 bg-cream rounded">
                    <span>{e.category}</span>
                    <span className="text-red-600 font-medium">{formatCurrency(e.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
