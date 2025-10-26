// Dev-only mock for /api/admin/* requests. Will not run in production.
const isDev = import.meta.env?.DEV ?? true;
if (isDev) {
  const orders = [
    { id: "ord_1", customerName: "علی رضایی", origin: "تهران، نارمک", destination: "تهران، سعادت‌آباد", status: "pending", price: 1200000, createdAt: new Date().toISOString() },
    { id: "ord_2", customerName: "زهرا موسوی", origin: "کرج، باغستان", destination: "تهران، میدان ونک", status: "confirmed", price: 2500000, createdAt: new Date().toISOString() },
  ];

  const drivers = [
    { id: "drv_1", name: "حسن حسینی", phone: "09120000001", active: true },
    { id: "drv_2", name: "مهدی محمدی", phone: "09120000002", active: false },
  ];

  const users = [
    { id: "usr_1", name: "علی رضایی", email: "ali@example.com", active: true },
    { id: "usr_2", name: "زهرا موسوی", email: "zahra@example.com", active: true },
  ];

  // Simple helper to build Response
  function jsonResponse(data: any, code = 200) {
    return new Response(JSON.stringify(data), {
      status: code,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Patch fetch
  const originalFetch = window.fetch.bind(window);
  // @ts-ignore
  window.fetch = async (input: RequestInfo, init?: RequestInit) => {
    try {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      const u = new URL(url, window.location.origin);
      if (u.pathname.startsWith("/api/admin/")) {
        // emulate network delay
        await new Promise((r) => setTimeout(r, 120));
        // routes
        if (u.pathname === "/api/admin/stats") {
          const pending = orders.filter((o) => o.status === "pending").length;
          const todayIncome = orders.reduce((s, o) => s + (o.price || 0), 0);
          const activeDrivers = drivers.filter((d) => d.active).length;
          return jsonResponse({ pendingOrders: pending, todayIncome, activeDrivers, pendingSettlements: 0 });
        }

        if (u.pathname === "/api/admin/orders") {
          const page = Number(u.searchParams.get("page") || "1");
          const perPage = Number(u.searchParams.get("perPage") || "10");
          const start = (page - 1) * perPage;
          return jsonResponse({ orders: orders.slice(start, start + perPage), total: orders.length });
        }

        const orderMatch = u.pathname.match(/^\/api\/admin\/orders\/(.+)$/);
        if (orderMatch) {
          const id = orderMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const order = orders.find((o) => o.id === id);
            if (!order) return jsonResponse({ error: "Order not found" }, 404);
            if (body.status !== undefined) order.status = body.status;
            if (body.price !== undefined) order.price = body.price;
            return jsonResponse(order);
          }
          const order = orders.find((o) => o.id === id);
          if (!order) return jsonResponse({ error: "Order not found" }, 404);
          return jsonResponse(order);
        }

        if (u.pathname === "/api/admin/drivers") {
          if ((init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            if (!body.name) return jsonResponse({ error: "name required" }, 400);
            const newDriver = { id: `drv_${Date.now()}`, name: body.name, phone: body.phone || null, active: true };
            drivers.push(newDriver);
            return jsonResponse(newDriver, 201);
          }
          return jsonResponse({ drivers });
        }

        const driverMatch = u.pathname.match(/^\/api\/admin\/drivers\/(.+)$/);
        if (driverMatch) {
          const id = driverMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH" || (init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const driver = drivers.find((d) => d.id === id);
            if (!driver) return jsonResponse({ error: "Driver not found" }, 404);
            if (body.active !== undefined) driver.active = Boolean(body.active);
            if (body.name !== undefined) driver.name = body.name;
            if (body.phone !== undefined) driver.phone = body.phone;
            return jsonResponse(driver);
          }
        }

        if (u.pathname === "/api/admin/users") {
          const search = u.searchParams.get("search") || "";
          if (search) {
            const filtered = users.filter((u2) => u2.name.toLowerCase().includes(search.toLowerCase()) || (u2.email || "").toLowerCase().includes(search.toLowerCase()));
            return jsonResponse({ users: filtered });
          }
          return jsonResponse({ users });
        }

        const userMatch = u.pathname.match(/^\/api\/admin\/users\/(.+)$/);
        if (userMatch) {
          const id = userMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const user = users.find((u2) => u2.id === id);
            if (!user) return jsonResponse({ error: "User not found" }, 404);
            if (body.active !== undefined) user.active = Boolean(body.active);
            if (body.name !== undefined) user.name = body.name;
            if (body.email !== undefined) user.email = body.email;
            return jsonResponse(user);
          }
        }
      }
    } catch (e) {
      // ignore and fallthrough to real fetch
      console.error("mockAdmin fetch error:", e);
    }
    return originalFetch(input, init);
  };
}
