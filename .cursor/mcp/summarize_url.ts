import { prompt, z, type PromptHandler } from "mcpez";

const summarizeMarkdownHandler: PromptHandler = async ({ url }) => {
  const response = await fetch(`https://into.md/${url}`);
  const markdown = await response.text();
  
  const prompt = `List the three main points of the following markdown: ${markdown}.`;

  Bun.write("prompt.txt", prompt);

  const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt ]);
  const result = await child.stdout.text();
  return {
    messages: [
      {
        role: "assistant",
        content: { type: "text", text: result },
      },
    ],
  };
};

prompt(
  "Summarize markdown",
  {
    description:
      "Fetches the page as markdown (into.md) and instructs the model to summarize with the required opening sentence.",
    argsSchema: {
      url: z.string().describe("The URL of the page to fetch and summarize"),
    },
  },
  summarizeMarkdownHandler,
);
