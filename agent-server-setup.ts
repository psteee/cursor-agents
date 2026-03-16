/**
 * Agent task: set up or update a Bun HTTP server with demo and store endpoints.
 * Run with: bun agent-server-setup.ts
 *
 * Follows the same pattern as index.ts: spawn agent with --model composer-1 --print.
 */

const SERVER_SETUP_PROMPT = `You are working in a Bun-only project (no Express, no Node/npm/vite).

Create or update server.ts with:

1. A StoreItem type: { id: string; name: string; price: number; inStock: boolean; }

2. A mutable StoreItems array (const StoreItems: StoreItem[] = [...]) with a few sample items so more can be added later.

3. Bun.serve({ port: 3000, fetch(req) { ... } }) with:
   - GET "/" → return plain "OK" (health check)
   - POST "/demo" → parse JSON body, return JSON { received, message: "Demo object received successfully", timestamp }
   - GET "/store/latest" → return JSON { items: StoreItems, count: StoreItems.length, lastUpdated: ISO timestamp }
   - GET "/store/erliest" → return JSON { items: StoreItems, count: StoreItems.length, lastUpdated: ISO timestamp }
   - 404 for other routes. Use Response.json() where appropriate; return 400 for invalid JSON on /demo.

Use only Bun APIs. Do not add Express or other dependencies. Keep the file minimal and runnable with: bun server.ts`;

const child = Bun.spawn(["agent", "--model", "composer-1", "--print", SERVER_SETUP_PROMPT]);
const output = await child.stdout.text();
console.log(output);
