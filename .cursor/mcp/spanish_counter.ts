import { prompt, z, type PromptHandler } from "mcpez";


const spanishCounterHandler: PromptHandler = async ({ countTo }) => {
    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: `Please count to ${countTo} in Spanish`,
                },
            },
        ],
    }
}

prompt("Spanish Counter", {
    description: "Just a counter in spanish",
    argsSchema: {
        countTo: z.string().describe("The number to count to"),
    },
}, spanishCounterHandler);
