import { RequestHandler } from "express";

// In-memory mock data
let orders = [
  { id: "ord_1", customerName: "علی رضایی", origin: "تهران، نارمک", destination: "تهران، سعادت‌آباد", status: "pending", price: 1200000, createdAt: new Date().toISOString() },
  { id: "ord_2", customerName: "زهرا موسوی", origin: "کرج، باغستان", destination: "تهران، میدان ونک", status: "confirmed", price: 2500000, createdAt: new Date().toISOString() },
];

let drivers = [
  { id: "drv_1", name: "حسن حسینی", phone: "09120000001", active: true },
  { id: "drv_2", name: "مهدی محمدی", phone: "09120000002", active: false },
];

let users = [
  { id: "usr_1", name: "علی رضایی", email: "ali@example.com", active: true },
  { id: "usr_2", name: "زهرا موسوی", email: "zahra@example.com", active: true },
];

export const getStats: RequestHandler = (_req, res) => {
  const pending = orders.filter((o) => o.status === "pending").length;
  const todayIncome = orders.reduce((s, o) => s + (o.price || 0), 0);
  const activeDrivers = drivers.filter((d) => d.active).length;
  const pendingSettlements = 0;
  res.json({ pendingOrders: pending, todayIncome, activeDrivers, pendingSettlements });
};

export const getOrders: RequestHandler = (req, res) => {
  const page = Number(req.query.page || 1);
  const perPage = Number(req.query.perPage || 10);
  const start = (page - 1) * perPage;
  const paged = orders.slice(start, start + perPage);
  res.json({ orders: paged, total: orders.length });
};

export const getOrderById: RequestHandler = (req, res) => {
  const id = req.params.id;
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
};

export const patchOrder: RequestHandler = (req, res) => {
  const id = req.params.id;
  const order = orders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const { status, price } = req.body;
  if (status !== undefined) order.status = status;
  if (price !== undefined) order.price = price;
  res.json(order);
};

export const getDrivers: RequestHandler = (_req, res) => {
  res.json({ drivers });
};

export const postDriver: RequestHandler = (req, res) => {
  const { name, phone } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const newDriver = { id: `drv_${Date.now()}`, name, phone: phone || null, active: true };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
};

export const patchDriver: RequestHandler = (req, res) => {
  const id = req.params.id;
  const driver = drivers.find((d) => d.id === id);
  if (!driver) return res.status(404).json({ error: "Driver not found" });
  const { active, name, phone } = req.body;
  if (active !== undefined) driver.active = Boolean(active);
  if (name !== undefined) driver.name = name;
  if (phone !== undefined) driver.phone = phone;
  res.json(driver);
};

export const getUsers: RequestHandler = (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  if (search) {
    const filtered = users.filter((u) => u.name.toLowerCase().includes(search) || (u.email || "").toLowerCase().includes(search));
    return res.json({ users: filtered });
  }
  res.json({ users });
};

export const patchUser: RequestHandler = (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { active, name, email } = req.body;
  if (active !== undefined) user.active = Boolean(active);
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  res.json(user);
};
