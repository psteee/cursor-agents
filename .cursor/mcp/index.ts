import {prompt, z, type PromptHandler} from "mcpez";

const helloHandler: PromptHandler = async ({countTo}) => {
    return {
        messages: [
            {
                role: "assistant",
                content: {
                    type: "text",
                    text: `Please count to ${countTo} in spanish`,
                },
            }
        ]
    };
}

prompt("Counter agent", { 
    description: "Just count in spanish",
    argsSchema: {
        countTo: z.string().describe("The number to count to"),
    }
}, helloHandler);



   