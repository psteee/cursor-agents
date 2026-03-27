import { tool,  z } from "mcpez";

tool(
  "chiedi-a-gemini",
  {
    description: "Invia un prompt a Gemini 2.5 Flash e restituisce la risposta direttamente",
    inputSchema: {
      query: z.string().describe("Il prompt da inviare a Gemini"),
    },
  },
  async ({ query }: { query: string }) => {
    const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", query]);
    const result = await child.stdout.text();
    return { content: [{ type: "text", text: result }] };
  }
);

