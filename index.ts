const fileSummaryGenerator = async ( file: string ) => {
    const prompt = ` Per favore fammi un riassunto del seguenti file: ${file} e riporta solo il riassunto, niente altro `;
    const child = Bun.spawn(["cursor-agent", "--model", "composer-1", "--print", prompt]);
    const result = await child.stdout.text();
    return result;
  }
  
  const files = [ "riddles.ts", "index.ts", "summary.ts", "README.md" ];
  const summaries = await Promise.all(files.map(fileSummaryGenerator));
  console.log(summaries); 
  