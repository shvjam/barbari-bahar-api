import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useToast } from "@/hooks/use-toast";

export function useSignalR() {
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/api/notificationhub", { // Adjust the URL to your hub endpoint
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("SignalR Connected."))
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connection.on("OrderStatusChanged", (orderId, newStatus) => {
      toast({
        title: "وضعیت سفارش بروز شد",
        description: `وضعیت سفارش شماره ${orderId} به "${newStatus}" تغییر کرد.`,
      });
    });

    connection.on("DriverAssigned", (orderId, driverDetails) => {
      toast({
        title: "راننده به سفارش شما تخصیص یافت",
        description: `راننده ${driverDetails.name} برای سفارش شماره ${orderId} در راه است.`,
      });
    });

    connection.on("NewTicketReply", (ticketId) => {
      toast({
        title: "پاسخ جدید برای تیکت شما",
        description: `یک پاسخ جدید برای تیکت شماره ${ticketId} ثبت شد.`,
      });
    });

    return () => {
      connection.stop();
    };
  }, [toast]);
}
