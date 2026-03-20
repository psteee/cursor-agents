import {prompt, z, type PromptHandler} from "mcpez";

const intoMarkdownHandler: PromptHandler = async ({url}) => {

const response = await fetch(`https://into.md/${url}`);
const markdown = await response.text();
    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: `${markdown}
    
    ---
    
    Please show me the markdown version of the following URL: ${url}`,
                },
            }
        ]
    };
}

prompt("Into markdown", { 
    description: "Returns a markdown version of the given URL",
    argsSchema: {
        url: z.string().describe("The URL to convert to markdown"),
    }
}, intoMarkdownHandler);



   