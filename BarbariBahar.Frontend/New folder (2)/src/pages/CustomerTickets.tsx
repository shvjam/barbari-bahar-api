import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";

type Ticket = {
  id: number;
  subject: string;
  status: string;
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

export default function CustomerTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "new" | "details">("list");
  const [selectedTicket, setSelectedTicket] = useState<TicketDetails | null>(
    null,
  );
  const { toast } = useToast();

  // Form states for new ticket
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/Tickets");
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
    if (view === "list") {
      loadTickets();
    }
  }, [view]);

  const handleViewDetails = async (id: number) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/Tickets/${id}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setSelectedTicket(data);
      setView("details");
    } catch (err) {
      toast({ title: "خطا در مشاهده جزئیات", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject || !message)
      return toast({ title: "موضوع و پیام را وارد کنید" });
    setLoading(true);
    try {
      const res = await apiFetch("/api/Tickets", {
        method: "POST",
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      toast({ title: "تیکت با موفقیت ثبت شد" });
      setSubject("");
      setMessage("");
      setView("list");
    } catch (err) {
      toast({ title: "خطا در ثبت تیکت", description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  if (view === "new") {
    return (
      <Card>
        <CardContent>
          <h3 className="text-lg font-bold mb-4">ثبت تیکت جدید</h3>
          <div className="grid gap-4">
            <Input
              placeholder="موضوع"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              placeholder="پیام شما..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleCreateTicket} disabled={loading}>
              {loading ? "در حال ارسال..." : "ارسال تیکت"}
            </Button>
            <Button variant="outline" onClick={() => setView("list")}>
              بازگشت
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (view === "details" && selectedTicket) {
    return (
      <Card>
        <CardContent>
          <h3 className="text-lg font-bold mb-4">
            جزئیات تیکت: {selectedTicket.subject}
          </h3>
          <div className="space-y-4">
            {selectedTicket.messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  msg.sentBy === "Customer" ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setView("list")}
            className="mt-4"
          >
            بازگشت به لیست
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">تیکت‌های پشتیبانی</h3>
        <Button onClick={() => setView("new")}>ثبت تیکت جدید</Button>
      </div>
      <Card>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center">در حال بارگیری...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-2 text-right">موضوع</th>
                  <th className="pb-2 text-right">وضعیت</th>
                  <th className="pb-2 text-right">تاریخ</th>
                  <th className="pb-2 text-right">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t">
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
                        مشاهده
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
