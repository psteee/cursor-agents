import { prompt, z } from "mcpez";

prompt(
    "chiedi-a-gemini-prompt",
    {
      description: "Invia un prompt a Gemini 2.5 Flash e inserisce la risposta come contesto nella conversazione",
      argsSchema: {
        query: z.string().describe("Il prompt da inviare a Gemini"),
      },
    },
    async ({ query }) => {
      const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", "--prompt", query as string]);
      const result = await child.stdout.text();
      return {
        messages: [
          { role: "assistant", content: { type: "text", text: `Return the response from Gemini for the following prompt: ${query} and the result is: ${result}` } },          
        ],
      };
    }
  );
  