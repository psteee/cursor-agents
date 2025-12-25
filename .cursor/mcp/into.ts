import { prompt, z, type PromptHandler } from "mcpez";


const intoMarkdownHandler: PromptHandler = async ({ url }) => {


const response = await fetch(`https://into.md/${url}`);
const markdown = await response.text();

    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: `${markdown}
                    
                    -----

                    Please summarize the above webpage
                    `                    
                },
            },
        ],
    }
}

prompt("into markdown", {
    description: " Returns an URL as Markdown",
    argsSchema: {
        url: z.string().describe("The URL to convert to Markdown"),
    },
}, intoMarkdownHandler);
