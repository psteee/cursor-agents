// Agent per creare server demo con Bun.serve() e integrazione cursor-agent
// Segue il pattern di index.ts: usa Bun.spawn con cursor-agent per generare codice

type ServerTask = {
  type: "create-server" | "create-shop" | "create-api" | "generate-content";
  description: string;
  details?: Record<string, unknown>;
};

const createServerAgent = async (task: ServerTask): Promise<string> => {
  const prompt = `
Sei un assistente esperto nello sviluppo con Bun e TypeScript.

Il progetto segue queste linee guida:
- Usa Bun invece di Node.js, npm, o Express
- Usa Bun.serve() per creare server HTTP (non Express)
- Separa la logica del server in file separati (es: server-logic.ts)
- L'entry point (server.ts) deve solo importare e avviare il server
- Usa Bun.spawn(["cursor-agent", "--model", "composer-1", "--print", prompt]) per generare contenuti
- Le API REST devono supportare GET, POST, PUT, DELETE
- Usa TypeScript con tipi appropriati
- Gestisci errori e logging appropriati

Task richiesto: ${task.type}
Descrizione: ${task.description}
${task.details ? `Dettagli aggiuntivi: ${JSON.stringify(task.details, null, 2)}` : ""}

Per favore genera il codice TypeScript necessario seguendo esattamente queste linee guida.
Rispondi SOLO con il codice TypeScript, senza spiegazioni aggiuntive.
Se servono più file, indica chiaramente quale file è quale con commenti tipo: // FILE: nome-file.ts
`;

  const child = Bun.spawn([
    "cursor-agent",
    "--model",
    "composer-1",
    "--print",
    prompt,
  ]);

  const result = await child.stdout.text();
  return result;
};

// Esempi di utilizzo dell'agent

// 1. Creare un server base con Bun.serve()
export const createBasicServer = async () => {
  return await createServerAgent({
    type: "create-server",
    description:
      "Crea un server HTTP base con Bun.serve() che risponde a GET / con un messaggio di benvenuto",
  });
};

// 2. Creare un negozio/shop con prodotti
export const createShopServer = async (genere: string) => {
  return await createServerAgent({
    type: "create-shop",
    description:
      `Crea un server che simula un negozio online di "${genere}" con API REST per prodotti (GET, POST, PUT, DELETE /api/products). I prodotti devono essere generati usando cursor-agent  tramite Bun.spawn`,
    details: {
      productFields: ["id", "name", "price", "description"],
      initialProductsCount: 5,
    },
  });
};

// 3. Creare API REST generiche
export const createRestAPI = async (
  resourceName: string,
  fields: string[]
) => {
  return await createServerAgent({
    type: "create-api",
    description: `Crea un'API REST completa per la risorsa "${resourceName}" con CRUD completo`,
    details: {
      resourceName,
      fields,
      endpoints: ["GET /api/:resource", "GET /api/:resource/:id", "POST /api/:resource", "PUT /api/:resource/:id", "DELETE /api/:resource/:id"],
    },
  });
};

// 4. Generare contenuti usando cursor-agent
export const generateContent = async (
  contentType: string,
  count: number = 1
) => {
  return await createServerAgent({
    type: "generate-content",
    description: `Genera ${count} ${contentType} usando cursor-agent. La funzione deve restituire un array di oggetti in formato JSON`,
    details: {
      contentType,
      count,
      outputFormat: "JSON array",
    },
  });
};

// Funzione principale per eseguire task multipli
export const runServerAgent = async (task: ServerTask) => {
  console.log(`[Server Agent] Eseguendo task: ${task.type}`);
  console.log(`[Server Agent] Descrizione: ${task.description}`);
  
  const result = await createServerAgent(task);
  
  console.log(`[Server Agent] Task completato. Output:`);
  console.log("---");
  console.log(result);
  console.log("---");
  
  return result;
};

// Esempio di utilizzo:
 const code = await createShopServer("abbigliamento");

 console.log(code);




