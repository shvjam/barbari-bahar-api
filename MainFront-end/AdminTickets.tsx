import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Ticket = {
  id: number;
  subject: string;
  status: string;
  userName: string;
  createdAt: string;
};

type TicketDetails = Ticket & {
  messages: { sentBy: string; message: string; createdAt: string }[];
};

function apiFetch(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(path, { ...opts, headers });
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/tickets");
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setTickets(data || []);
    } catch (err) {
      toast({ title: "خطا در بارگیری تیکت‌ها", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/tickets/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setSelectedTicket(data);
    } catch (err) {
      toast({ title: "خطا در مشاهده جزئیات", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage) return;
    setLoading(true);
    try {
      const res = await apiFetch(`/api/admin/tickets/${selectedTicket.id}/reply`, {
        method: "POST",
        body: JSON.stringify({ message: replyMessage }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "پاسخ ارسال شد" });
      setReplyMessage("");
      // Refresh details
      handleViewDetails(selectedTicket.id);
    } catch (err) {
      toast({ title: "خطا در ارسال پاسخ", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  if (selectedTicket) {
    return (
      <Card>
        <CardContent>
          <Button variant="outline" onClick={() => setSelectedTicket(null)}>
            &rarr; بازگشت به لیست
          </Button>
          <h3 className="text-lg font-bold my-4">
            جزئیات تیکت: {selectedTicket.subject}
          </h3>
          <div className="space-y-4 mb-4">
            {selectedTicket.messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.sentBy === "Admin" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
            ))}
          </div>
          <Textarea
            placeholder="پاسخ خود را بنویسید..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <Button onClick={handleSendReply} disabled={loading} className="mt-2">
            {loading ? "در حال ارسال..." : "ارسال پاسخ"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <h3 className="text-lg font-bold mb-4">مدیریت تیکت‌ها</h3>
        {loading ? (
          <div className="py-6 text-center">در حال بارگیری...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="pb-2 text-right">کاربر</th>
                <th className="pb-2 text-right">موضوع</th>
                <th className="pb-2 text-right">وضعیت</th>
                <th className="pb-2 text-right">تاریخ</th>
                <th className="pb-2 text-right">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t">
                  <td className="py-2">{ticket.userName}</td>
                  <td className="py-2">{ticket.subject}</td>
                  <td className="py-2">{ticket.status}</td>
                  <td className="py-2">
                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="py-2">
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(ticket.id)}
                    >
                      مشاهده و پاسخ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
