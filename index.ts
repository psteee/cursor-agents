const child = Bun.spawn(["cursor-agent", "--model", "composer-1", "--print", 
    "Per favore creami un readme.md e riempilo con i dettagli di questo progetto"])

const result = await child.stdout.text();

console.log(result);