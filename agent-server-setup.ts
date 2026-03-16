/**
 * Agent task: set up or update a Bun HTTP server with demo and store endpoints.
 *
 * Usage:
 *   - Init server:
 *       bun agent-server-setup.ts --INIT
 *   - Add an endpoint (generico):
 *       bun agent-server-setup.ts --ADD <nome_endpoint> "Descrizione in linguaggio naturale di cosa deve fare l'endpoint"
 *   - Remove an endpoint:
 *       bun agent-server-setup.ts --REMOVE <nome_endpoint>
 *   - List all endpoints with descriptions:
 *       bun agent-server-setup.ts --LIST
 *   - Show help:
 *       bun agent-server-setup.ts --HELP
 *
 * Esempio:
 *   bun agent-server-setup.ts --ADD sort "Ordina gli item per prezzo crescente e restituisci gli stessi campi degli altri endpoint"
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

const [, , ...args] = Bun.argv;

// If user asks for help, print usage and exit without calling the agent
if (args[0] === "--HELP" || args[0] === "-h" || args[0] === undefined) {
  const helpText = `
agent-server-setup.ts - helper per configurare e mantenere il server Bun (server.ts)

Comandi:
  --INIT
    Inizializza o ricostruisce server.ts con:
      - tipo StoreItem
      - array StoreItems
      - Bun.serve con endpoint /, /demo, /store/latest e 404 di fallback
    Esempio:
      bun agent-server-setup.ts --INIT

  --ADD <nome_endpoint> "Descrizione..."
    Aggiunge un nuovo endpoint al server esistente, usando la descrizione in linguaggio naturale per definire il comportamento.
    Esempi:
      bun agent-server-setup.ts --ADD sort "Ordina gli item per prezzo crescente e restituisci gli stessi campi degli altri endpoint"
      bun agent-server-setup.ts --ADD checkout "Crea un endpoint che simula il checkout e restituisce il totale degli item"

  --REMOVE <nome_endpoint>
    Rimuove l'endpoint che gestisce il path corrispondente (\"/<nome_endpoint>\") lasciando intatti gli altri.
    Esempio:
      bun agent-server-setup.ts --REMOVE sort

  --LIST
    Legge server.ts e stampa l'elenco degli endpoint esistenti con una breve descrizione di cosa fanno.
    Esempio:
      bun agent-server-setup.ts --LIST

  --HELP
    Mostra questo messaggio.
`;

  console.log(helpText.trim());
  process.exit(0);
}

let promptToUse = SERVER_SETUP_PROMPT;

// Generic ADD <endpoint> "<descrizione>"
if (args[0] === "--ADD" && args[1]) {
  const endpointName = args[1];
  const description = args.slice(2).join(" ") || "Nessuna descrizione fornita.";

  const addEndpointPrompt = `You are working in the same Bun-only project and there is already a server.ts file created as described in the INIT prompt (StoreItem, StoreItems, Bun.serve, /, /demo, /store/latest).

Update *only* server.ts by adding a new endpoint.

Endpoint to add:
  - Path: "/${endpointName}"
  - Behavior (natural language description from the user):
    "${description}"

Strict requirements:
1. Do not remove or change existing endpoints, types, or the StoreItems data structure unless absolutely necessary for the new behavior.
2. Implement the new endpoint inside the existing Bun.serve fetch handler, using the same style:
   - Check both req.method and url.pathname.
   - Use Response.json() for JSON responses and explicit HTTP status codes where appropriate.
3. Re-use existing types and variables where possible (for example StoreItem and StoreItems).
4. Keep everything Bun-only (no Express, no external HTTP frameworks).
5. The server must remain runnable with: bun server.ts.

Answer by showing the full updated contents of server.ts that satisfies the above behavior for "/${endpointName}".`;

  promptToUse = addEndpointPrompt;
}

// Generic REMOVE <endpoint>
if (args[0] === "--REMOVE" && args[1]) {
  const endpointName = args[1];

  const removeEndpointPrompt = `You are working in the same Bun-only project and there is already a server.ts file created as described in the INIT prompt (StoreItem, StoreItems, Bun.serve, /, /demo, /store/latest).

Update *only* server.ts by removing the endpoint whose path matches:
  "/${endpointName}"

Strict requirements:
1. Do not remove or change other endpoints, types, or the StoreItems data structure.
2. Keep the Bun.serve structure and remaining branches intact.
3. After removal, server.ts must still compile and the server must remain runnable with: bun server.ts.
4. If multiple branches handle "/${endpointName}", remove only the one that is clearly the dedicated handler for that path (keep generic 404 / fallback logic).

Answer by showing the full updated contents of server.ts with the "/${endpointName}" endpoint removed.`;

  promptToUse = removeEndpointPrompt;
}

// LIST: show all endpoints and what they do
if (args[0] === "--LIST") {
  const listPrompt = `You are working in the same Bun-only project and there is already a server.ts file created as described in the INIT prompt (StoreItem, StoreItems, Bun.serve, /, /demo, /store/latest).

Your task is to read the current server.ts (assume it is up to date in this workspace) and output a concise list of all HTTP endpoints the server exposes.

For each endpoint, include:
  - HTTP method (GET, POST, etc.)
  - Path (for example "/", "/demo", "/store/latest")
  - A short natural language description (1–2 sentences max) of what it does and what it returns.

Format the answer as plain text in this shape:

METHOD PATH - short description

For example:
GET / - Health check, returns plain text "OK".
POST /demo - Accepts a JSON body and echoes it back with a message and timestamp.

Only describe real, explicit handlers you find in server.ts (do not invent endpoints). Mention the default 404 / fallback behavior at the end if it exists.`;

  promptToUse = listPrompt;
}

const child = Bun.spawn(["agent", "--model", "composer-1", "--print", promptToUse]);
//const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", promptToUse]);
const output = await child.stdout.text();
console.log(output);
