const fileSummaryGenerator = async (file: string) => {

    const prompt = `Please generate a summary of the following file: ${file}.`
    const child = Bun.spawn(["agent", "--model", "composer-1", "--print", prompt ])
    const result = await child.stdout.text();
    return result;
}

const files = ["index.ts", "README.md", "package.json"];

const summaries = await Promise.all(files.map(fileSummaryGenerator));

//console.log(summaries);

for (const summary of summaries) {
    console.log(summary);
}