import { prompt, z, type PromptHandler } from "mcpez";

const MAX_MARKDOWN_CHARS = 200_000;

const summarizeMarkdownHandler: PromptHandler = async ({ url }) => {
  const response = await fetch(`https://into.md/${url}`);
  if (!response.ok) {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Summarize markdown could not load the page (HTTP ${response.status}): ${url}`,
          },
        },
      ],
    };
  }
  let markdown = await response.text();
  if (markdown.length > MAX_MARKDOWN_CHARS) {
    markdown =
      markdown.slice(0, MAX_MARKDOWN_CHARS) +
      "\n\n[… markdown truncated for length …]";
  }

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `The following is markdown for this page (source URL: ${url}).

Summarize it for the user.

You MUST begin your answer with this exact English sentence on its own line:
The three main points of the following markdown are:

After that line, give the threemain facts clearly (bullets or short paragraphs).

--- markdown ---

${markdown}

--- end markdown ---`,
        },
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
