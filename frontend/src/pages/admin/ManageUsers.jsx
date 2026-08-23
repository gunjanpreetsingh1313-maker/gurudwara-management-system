import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/auth/users').then((r) => setUsers(r.data));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete user?')) return;
    await api.delete(`/auth/users/${id}`);
    toast.success('User deleted');
    setUsers(users.filter((u) => u._id !== id));
  };

  const toggleActive = async (user) => {
    await api.put(`/auth/users/${user._id}`, { isActive: !user.isActive });
    toast.success('Updated');
    setUsers(users.map((u) => u._id === user._id ? { ...u, isActive: !u.isActive } : u));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th><th className="p-3 text-left">Status</th><th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-cream">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-saffron/20 text-saffron-dark' : 'bg-gray-100'}`}>{u.role}</span></td>
                <td className="p-3">
                  <button onClick={() => toggleActive(u)} className={`text-xs px-2 py-0.5 rounded ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3 text-center">
                  {u.role !== 'admin' && <button onClick={() => handleDelete(u._id)} className="text-red-500"><FaTrash /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
