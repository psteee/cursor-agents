// FILE: server.ts
import { port, createFetchHandler } from "./server-logic";

const server = Bun.serve({
  port,
  fetch: createFetchHandler(),
});

console.log(`Server negozio online in ascolto su http://localhost:${server.port}`);
