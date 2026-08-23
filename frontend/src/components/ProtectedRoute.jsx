import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}
