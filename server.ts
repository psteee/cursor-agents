type StoreItem = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

const StoreItems: StoreItem[] = [
  { id: "item-1", name: "Widget Pro", price: 49.99, inStock: true },
  { id: "item-2", name: "Gadget Max", price: 79.99, inStock: true },
  { id: "item-3", name: "Doohickey Mini", price: 19.99, inStock: false },
];

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // Basic health check
    if (req.method === "GET" && url.pathname === "/") {
      return new Response("OK", { status: 200 });
    }

    // Simple JSON POST endpoint for demo objects
    if (req.method === "POST" && url.pathname === "/demo") {
      try {
        const body = await req.json();
        console.log("Received object:", body);

        return Response.json({
          received: body,
          message: "Demo object received successfully",
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        return Response.json({ error: "Invalid JSON payload" }, {
          status: 400,
        });
      }
    }

    // Mock "latest items from the store"
    if (req.method === "GET" && url.pathname === "/store/latest") {
      return Response.json({
        items: StoreItems,
        count: StoreItems.length,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Mock "earliest items from the store"
    if (req.method === "GET" && url.pathname === "/store/erliest") {
      return Response.json({
        items: StoreItems,
        count: StoreItems.length,
        lastUpdated: new Date().toISOString(),
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);
