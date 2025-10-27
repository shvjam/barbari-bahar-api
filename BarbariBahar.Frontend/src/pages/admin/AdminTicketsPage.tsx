// src/pages/admin/AdminTicketsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

interface TicketSummary {
  id: number;
  subject: string;
  status: string;
  lastUpdatedAt: string;
  // We might want to add customerName to the DTO later
}

const AdminTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const response = await api.get<TicketSummary[]>('/tickets');
        setTickets(response.data);
      } catch (err) {
        console.error(err);
        setError('خطا در دریافت لیست تیکت‌ها.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'InProgress': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  if (error) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">مدیریت تیکت‌ها</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={48} /></div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="py-3 px-4">کد تیکت</th>
                <th className="py-3 px-4">موضوع</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4">آخرین به‌روزرسانی</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? tickets.map(ticket => (
                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono">#{ticket.id}</td>
                  <td className="py-3 px-4">{ticket.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{formatDate(ticket.lastUpdatedAt)}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/admin/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-800">
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    هیچ تیکتی برای نمایش وجود ندارد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminTicketsPage;
