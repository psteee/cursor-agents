import { prompt, z, type PromptHandler } from "mcpez";


const intoMarkdownHandler: PromptHandler = async ({ url }) => {


    const response = await fetch(`https://into.md/${url}`);
    const markdown = await response.text();


    const prompt = ` Per favore fammi un riassunto di tre punti importanti del seguente testo: ${markdown} e riporta solo il riassunto, niente altro `;
    const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt]);
    const result = await child.stdout.text();  


    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: result
                },
            },
        ],
    }
}

prompt("summarize markdown", {
    description: " Returns an URL as Markdown",
    argsSchema: {
        url: z.string().describe("The URL to convert to Markdown"),
    },
}, intoMarkdownHandler);
