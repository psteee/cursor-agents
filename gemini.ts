const files = ["index.ts", "README.md", "package.json"];

const summaries = await Promise.allSettled(
    files.map(async (file) => {
        const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", `Please generate a summary of the following file: @${file}.`]);
        return child.stdout.text();
    })
);

for (const summary of summaries) console.log(summary);