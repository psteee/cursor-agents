import { prompt, z, type PromptHandler } from "mcpez";


const generateImageHandler: PromptHandler = async ({ description }) => {


    const prompt = `/generate an image of ${description}`;
    const child = Bun.spawn(["gemini", prompt]);
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

prompt("generate image", {
    description: " Return an image generated from ia",
    argsSchema: {
        description: z.string().describe(" The image description"),
    
    },
}, generateImageHandler);
