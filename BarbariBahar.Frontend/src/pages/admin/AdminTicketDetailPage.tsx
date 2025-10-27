// src/pages/admin/AdminTicketDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, AlertTriangle, ArrowLeft, Send } from 'lucide-react';
import api from '../../services/api';

interface TicketMessage {
  senderName: string;
  message: string;
  sentAt: string;
}

interface TicketDetail {
  id: number;
  subject: string;
  status: string;
  createdAt: string;
  messages: TicketMessage[];
}

const AdminTicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get<TicketDetail>(`/tickets/${id}`);
      setTicket(response.data);
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت جزئیات تیکت.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsReplying(true);
    try {
      await api.post(`/tickets/${id}/reply`, { message: reply });
      setReply('');
      // Refresh details to show the new message
      fetchTicketDetails();
    } catch (err) {
      console.error(err);
      alert('خطا در ارسال پاسخ.');
    } finally {
      setIsReplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-primary" size={48} /></div>;
  }

  if (error || !ticket) {
    return <div className="flex justify-center items-center h-full bg-red-50 text-red-700 p-4 rounded-lg"><AlertTriangle className="ml-3" /> {error || 'تیکت یافت نشد.'}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{ticket.subject}</h2>
          <span className="text-gray-500">کد تیکت: #{ticket.id}</span>
        </div>
        <Link to="/admin/tickets" className="flex items-center text-gray-600 hover:text-black">
          <ArrowLeft className="ml-1" />
          بازگشت به لیست
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {/* Messages Thread */}
        <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-4">
          {ticket.messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">{msg.senderName}</span>
                <span className="text-xs text-gray-400">{formatDate(msg.sentAt)}</span>
              </div>
              <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded-lg">{msg.message}</p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReply}>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition"
            disabled={isReplying}
          />
          <button
            type="submit"
            disabled={isReplying || !reply.trim()}
            className="mt-4 w-full bg-primary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all disabled:bg-gray-400"
          >
            {isReplying ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
            <span>ارسال پاسخ</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminTicketDetailPage;
