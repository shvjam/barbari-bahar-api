import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Admin mock routes
  const admin = require("./routes/admin");
  app.get("/api/admin/stats", admin.getStats);
  app.get("/api/admin/orders", admin.getOrders);
  app.get("/api/admin/orders/:id", admin.getOrderById);
  app.patch("/api/admin/orders/:id", admin.patchOrder);

  app.get("/api/admin/drivers", admin.getDrivers);
  app.post("/api/admin/drivers", admin.postDriver);
  app.patch("/api/admin/drivers/:id", admin.patchDriver);

  app.get("/api/admin/users", admin.getUsers);
  app.patch("/api/admin/users/:id", admin.patchUser);

  return app;
}
