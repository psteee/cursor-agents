// Entry point del server: importa solo la logica definita altrove

import { port, createFetchHandler } from "./server-logic";

const server = Bun.serve({
  port,
  fetch: createFetchHandler(),
});

console.log(`Server di demo in ascolto su http://localhost:${server.port}`);

