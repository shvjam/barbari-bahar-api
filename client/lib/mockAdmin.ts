// Dev-only mock for /api/admin/* requests. Will not run in production.
const isDev = import.meta.env?.DEV ?? true;
if (isDev) {
  const orders = [
    {
      id: "ord_1",
      customerName: "علی رضایی",
      origin: "تهران، نارمک",
      destination: "تهران، سعادت‌آباد",
      status: "enroute",
      price: 1200000,
      createdAt: new Date().toISOString(),
      driverId: "drv_1",
    },
    {
      id: "ord_2",
      customerName: "زهرا موسوی",
      origin: "کرج، باغستان",
      destination: "تهران، میدان ونک",
      status: "confirmed",
      price: 2500000,
      createdAt: new Date().toISOString(),
      driverId: "drv_2",
    },
  ];

  const drivers = [
    { id: "drv_1", name: "حسن حسینی", phone: "09120000001", active: true },
    { id: "drv_2", name: "مهدی محمدی", phone: "09120000002", active: false },
  ];

  // driver live positions
  const driverPositions: Record<string, { lat: number; lon: number }> = {
    drv_1: { lat: 35.712, lon: 51.42 },
    drv_2: { lat: 35.789, lon: 51.45 },
  };

  const users = [
    { id: "usr_1", name: "علی رضایی", email: "ali@example.com", active: true },
    { id: "usr_2", name: "زهرا موسوی", email: "zahra@example.com", active: true },
  ];

  const productCategories = [
    { id: "pc_1", title: "خدمات" },
    { id: "pc_2", title: "وسیله نقلیه" },
  ];

  const itemCategories = [
    { id: "ic_1", title: "پک‌ها" },
    { id: "ic_2", title: "ماشین‌ها" },
  ];

  const products = [
    { id: "prd_1", title: "خدمت بسته‌بندی", sku: "PKG001", price: 200000, active: true, description: "خدمات حرفه‌ای بسته‌بندی اثاثیه", categoryId: "pc_1", image: null },
    { id: "prd_2", title: "خاور ۶ متری", sku: "TRK001", price: 800000, active: true, description: "حمل و نقل با خاور ۶ متری", categoryId: "pc_2", image: null },
  ];

  const items = [
    { id: "itm_1", productId: "prd_1", name: "پک بسته‌بندی فرش", amount: 50, unit: "عدد", price: 50000, categoryId: "ic_1" },
    { id: "itm_2", productId: "prd_2", name: "خاور استاندارد", amount: 1, unit: "دست", price: 800000, categoryId: "ic_2" },
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
      const url =
        typeof input === "string"
          ? input
          : input instanceof Request
            ? input.url
            : String(input);
      const u = new URL(url, window.location.origin);
      if (u.pathname.startsWith("/api/admin/")) {
        // emulate network delay
        await new Promise((r) => setTimeout(r, 120));
        // routes
        if (u.pathname === "/api/admin/stats") {
          const pending = orders.filter((o) => o.status === "pending").length;
          const todayIncome = orders.reduce((s, o) => s + (o.price || 0), 0);
          const activeDrivers = drivers.filter((d) => d.active).length;
          return jsonResponse({
            pendingOrders: pending,
            todayIncome,
            activeDrivers,
            pendingSettlements: 0,
          });
        }

        if (u.pathname === "/api/admin/orders") {
          const page = Number(u.searchParams.get("page") || "1");
          const perPage = Number(u.searchParams.get("perPage") || "10");
          const start = (page - 1) * perPage;
          return jsonResponse({
            orders: orders.slice(start, start + perPage),
            total: orders.length,
          });
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
            if (!body.name)
              return jsonResponse({ error: "name required" }, 400);
            const newDriver = {
              id: `drv_${Date.now()}`,
              name: body.name,
              phone: body.phone || null,
              active: true,
            };
            drivers.push(newDriver);
            return jsonResponse(newDriver, 201);
          }
          return jsonResponse({ drivers });
        }

        const driverMatch = u.pathname.match(/^\/api\/admin\/drivers\/(.+)$/);
        if (driverMatch) {
          const id = driverMatch[1];
          if (
            (init?.method || "GET").toUpperCase() === "PATCH" ||
            (init?.method || "GET").toUpperCase() === "POST"
          ) {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const driver = drivers.find((d) => d.id === id);
            if (!driver)
              return jsonResponse({ error: "Driver not found" }, 404);
            if (body.active !== undefined) driver.active = Boolean(body.active);
            if (body.name !== undefined) driver.name = body.name;
            if (body.phone !== undefined) driver.phone = body.phone;
            return jsonResponse(driver);
          }
        }

        if (u.pathname === "/api/admin/users") {
          const search = u.searchParams.get("search") || "";
          if (search) {
            const filtered = users.filter(
              (u2) =>
                u2.name.toLowerCase().includes(search.toLowerCase()) ||
                (u2.email || "").toLowerCase().includes(search.toLowerCase()),
            );
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

        // product categories
        if (u.pathname === "/api/admin/product-categories") {
          if ((init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            if (!body.title) return jsonResponse({ error: "title required" }, 400);
            const newCat = { id: `pc_${Date.now()}`, title: body.title };
            productCategories.unshift(newCat);
            return jsonResponse(newCat, 201);
          }
          return jsonResponse({ categories: productCategories });
        }

        const prodCatMatch = u.pathname.match(/^\/api\/admin\/product-categories\/(.+)$/);
        if (prodCatMatch) {
          const id = prodCatMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const cat = productCategories.find((c) => c.id === id);
            if (!cat) return jsonResponse({ error: "Category not found" }, 404);
            if (body.title !== undefined) cat.title = body.title;
            return jsonResponse(cat);
          }
          if ((init?.method || "GET").toUpperCase() === "DELETE") {
            const idx = productCategories.findIndex((c) => c.id === id);
            if (idx === -1) return jsonResponse({ error: "Category not found" }, 404);
            const removed = productCategories.splice(idx, 1)[0];
            return jsonResponse({ success: true, removed });
          }
          const cat = productCategories.find((c) => c.id === id);
          if (!cat) return jsonResponse({ error: "Category not found" }, 404);
          return jsonResponse(cat);
        }

        // item categories
        if (u.pathname === "/api/admin/item-categories") {
          if ((init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            if (!body.title) return jsonResponse({ error: "title required" }, 400);
            const newCat = { id: `ic_${Date.now()}`, title: body.title };
            itemCategories.unshift(newCat);
            return jsonResponse(newCat, 201);
          }
          return jsonResponse({ categories: itemCategories });
        }

        const itemCatMatch = u.pathname.match(/^\/api\/admin\/item-categories\/(.+)$/);
        if (itemCatMatch) {
          const id = itemCatMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const cat = itemCategories.find((c) => c.id === id);
            if (!cat) return jsonResponse({ error: "Category not found" }, 404);
            if (body.title !== undefined) cat.title = body.title;
            return jsonResponse(cat);
          }
          if ((init?.method || "GET").toUpperCase() === "DELETE") {
            const idx = itemCategories.findIndex((c) => c.id === id);
            if (idx === -1) return jsonResponse({ error: "Category not found" }, 404);
            const removed = itemCategories.splice(idx, 1)[0];
            return jsonResponse({ success: true, removed });
          }
          const cat = itemCategories.find((c) => c.id === id);
          if (!cat) return jsonResponse({ error: "Category not found" }, 404);
          return jsonResponse(cat);
        }

        // products CRUD
        if (u.pathname === "/api/admin/products") {
          if ((init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            if (!body.title)
              return jsonResponse({ error: "title required" }, 400);
            const newProd = {
              id: `prd_${Date.now()}`,
              title: body.title,
              sku: body.sku || null,
              price: Number(body.price) || 0,
              active: body.active !== undefined ? Boolean(body.active) : true,
              description: body.description || "",
              categoryId: body.categoryId || null,
              image: body.image || null,
            };
            products.unshift(newProd);
            return jsonResponse(newProd, 201);
          }
          return jsonResponse({ products });
        }

        const prodMatch = u.pathname.match(/^\/api\/admin\/products\/(.+)$/);
        if (prodMatch) {
          const id = prodMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const prod = products.find((p) => p.id === id);
            if (!prod) return jsonResponse({ error: "Product not found" }, 404);
            if (body.title !== undefined) prod.title = body.title;
            if (body.sku !== undefined) prod.sku = body.sku;
            if (body.price !== undefined) prod.price = Number(body.price);
            if (body.active !== undefined) prod.active = Boolean(body.active);
            if (body.description !== undefined)
              prod.description = body.description;
            if (body.categoryId !== undefined) prod.categoryId = body.categoryId;
            if (body.image !== undefined) prod.image = body.image;
            return jsonResponse(prod);
          }
          if ((init?.method || "GET").toUpperCase() === "DELETE") {
            const idx = products.findIndex((p) => p.id === id);
            if (idx === -1)
              return jsonResponse({ error: "Product not found" }, 404);
            const removed = products.splice(idx, 1)[0];
            return jsonResponse({ success: true, removed });
          }
          const prod = products.find((p) => p.id === id);
          if (!prod) return jsonResponse({ error: "Product not found" }, 404);
          return jsonResponse(prod);
        }

        // items CRUD
        if (u.pathname === "/api/admin/items") {
          if ((init?.method || "GET").toUpperCase() === "POST") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            if (!body.name)
              return jsonResponse({ error: "name required" }, 400);
            const newItem = {
              id: `itm_${Date.now()}`,
              productId: body.productId || null,
              name: body.name,
              quantity: Number(body.quantity) || 0,
              price: Number(body.price) || 0,
              unit: body.unit || "عدد",
              amount: Number(body.amount) || Number(body.quantity) || 0,
              categoryId: body.categoryId || null,
            };
            items.unshift(newItem);
            return jsonResponse(newItem, 201);
          }
          return jsonResponse({ items });
        }

        const itemMatch = u.pathname.match(/^\/api\/admin\/items\/(.+)$/);
        if (itemMatch) {
          const id = itemMatch[1];
          if ((init?.method || "GET").toUpperCase() === "PATCH") {
            const body = init?.body ? JSON.parse(String(init.body)) : {};
            const it = items.find((i) => i.id === id);
            if (!it) return jsonResponse({ error: "Item not found" }, 404);
            if (body.name !== undefined) it.name = body.name;
            if (body.productId !== undefined) it.productId = body.productId;
            if (body.quantity !== undefined)
              it.quantity = Number(body.quantity);
            if (body.price !== undefined) it.price = Number(body.price);
            if (body.unit !== undefined) it.unit = body.unit;
            if (body.amount !== undefined) it.amount = Number(body.amount);
            if (body.categoryId !== undefined) it.categoryId = body.categoryId;
            return jsonResponse(it);
          }
          if ((init?.method || "GET").toUpperCase() === "DELETE") {
            const idx = items.findIndex((i) => i.id === id);
            if (idx === -1)
              return jsonResponse({ error: "Item not found" }, 404);
            const removed = items.splice(idx, 1)[0];
            return jsonResponse({ success: true, removed });
          }
          const it = items.find((i) => i.id === id);
          if (!it) return jsonResponse({ error: "Item not found" }, 404);
          return jsonResponse(it);
        }

        // driver live location
        const drvLocMatch = u.pathname.match(
          /^\/api\/admin\/driver-location\/(.+)$/,
        );
        if (drvLocMatch) {
          const id = drvLocMatch[1];
          const pos = driverPositions[id];
          if (!pos) return jsonResponse({ error: "Driver not found" }, 404);
          // simulate movement
          pos.lat += (Math.random() - 0.5) * 0.0005;
          pos.lon += (Math.random() - 0.5) * 0.0005;
          return jsonResponse({ id, lat: pos.lat, lon: pos.lon });
        }
      }

      // /api/orders - create order (public)
      if (u.pathname === "/api/orders") {
        if ((init?.method || "GET").toUpperCase() === "POST") {
          const body = init?.body ? JSON.parse(String(init.body)) : {};
          const id = `ord_${Date.now()}`;
          const newOrder = {
            id,
            customerName: body.customerName || body.customer || "مشتری ناشناس",
            origin: body.originAddress?.label || "",
            destination: body.destAddress?.label || "",
            status: "pending",
            price: body.estimatedPrice || 0,
            createdAt: new Date().toISOString(),
            driverId: null,
          };
          orders.unshift(newOrder);
          return jsonResponse(newOrder, 201);
        }
      }

      // coupon validation
      if (u.pathname.startsWith("/api/coupons/")) {
        const code = u.pathname.split("/").pop();
        // simple validation: code DISCOUNT100 gives 100k
        if (code === "validate") {
          const q = u.searchParams.get("code") || "";
          if (q === "DISCOUNT100") {
            return jsonResponse({ valid: true, amountOff: 100000 });
          }
          return jsonResponse({ valid: false }, 200);
        }
      }
    } catch (e) {
      // ignore and fallthrough to real fetch
      console.error("mockAdmin fetch error:", e);
    }
    return originalFetch(input, init);
  };
}
