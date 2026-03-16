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

    // Delete an item from the store
    if (req.method === "DELETE" && url.pathname === "/un endpoint per eliminare un item dallo store") {
      const itemId = url.searchParams.get("id");
      
      if (!itemId) {
        return Response.json({ error: "Item ID is required" }, { status: 400 });
      }

      const itemIndex = StoreItems.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return Response.json({ error: "Item not found" }, { status: 404 });
      }

      const deletedItem = StoreItems[itemIndex];
      StoreItems.splice(itemIndex, 1);

      return Response.json({
        message: "Item deleted successfully",
        deletedItem: deletedItem,
        remainingCount: StoreItems.length,
      }, { status: 200 });
    }

    // Add a random AI-generated item to the store
    if (req.method === "GET" && url.pathname === "/random-item") {
      const randomNames = [
        "Quantum Widget", "Neural Gadget", "AI Assistant Pro", "Smart Device X",
        "Cyber Tool", "Digital Helper", "Tech Companion", "Virtual Assistant",
        "Intelligent Module", "Auto Processor", "Smart Sensor", "AI Controller"
      ];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomPrice = Math.round((Math.random() * 200 + 10) * 100) / 100; // Between 10.00 and 210.00
      const randomInStock = Math.random() > 0.5;
      const randomId = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newItem: StoreItem = {
        id: randomId,
        name: randomName,
        price: randomPrice,
        inStock: randomInStock,
      };

      StoreItems.push(newItem);

      return Response.json({
        message: "Random AI-generated item added successfully",
        item: newItem,
        totalCount: StoreItems.length,
      }, { status: 201 });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Server running on http://localhost:${server.port}`);
