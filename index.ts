const files = ["index.ts", "README.md", "package.json"];

const summaries = await Promise.all(
    files.map(async (file) => {
        const child = Bun.spawn(["agent", "--model", "composer-1", "--print", `Please generate a summary of the following file: ${file}.`]);
        return child.stdout.text();
    })
);

for (const summary of summaries) console.log(summary);