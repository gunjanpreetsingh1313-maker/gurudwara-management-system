export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const INCOME_CATEGORIES = ['Donations', 'Dasvandh', 'Langar Donation', 'Online Donation', 'Cash Donation', 'Bank Transfer', 'Other Income'];
export const EXPENSE_CATEGORIES = ['Langar', 'Electricity', 'Water', 'Salary', 'Cleaning', 'Building Maintenance', 'Religious Programs', 'Miscellaneous'];
export const PAYMENT_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Online', 'Cheque', 'Other'];
export const EVENT_TYPES = ['Gurpurab', 'Akhand Path', 'Kirtan', 'Langar Seva', 'Blood Donation Camp', 'Youth Camp', 'Other'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
