const fileOptimizer = async (file: string) => {

    const prompt = `Please optimize the following file for size and performance: ${file}.`
    const child = Bun.spawn(["agent", "--model", "composer-1", "--print", prompt ])
    const result = await child.stdout.text();
    return result;
}

const files = ["index.ts", "README.md", "package.json"];

const summaries = await Promise.all(files.map(fileOptimizer));

console.log(summaries);
