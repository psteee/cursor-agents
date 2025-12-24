const generatoreDiBarzellette = async (arg: string) => {
  const prompt = `Per favore genera una barzelletta con la seguente argomento: ${arg}, rispondi solo con la barzelletta`;
  const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt]);
  const result = await child.stdout.text();
  return result;
};

const generatoreDiArgomentiPerBarzellette = async () => {
  const prompt = `Per favore genera un argomento per una barzelletta, rispondi solo con l'argomento`;
  const child = Bun.spawn(["gemini", "--model", "gemini-2.5-flash", prompt]);
  const result = await child.stdout.text();
  return result;
};

// Genera argomenti in sequenza con 1 secondo di delay tra uno e l'altro
const argomenti: string[] = [];
for (let i = 0; i < 3; i++) {
  const arg = await generatoreDiArgomentiPerBarzellette();
  argomenti.push(arg.trim());
  if (i < 2) {
    // Aspetta 1 secondo prima del prossimo argomento (tranne dopo l'ultimo)
    await Bun.sleep(1000);
  }
}

console.log("Argomenti generati:", argomenti);

// Genera barzellette in sequenza con 1 secondo di delay tra una e l'altra
const barzellette: string[] = [];
for (let i = 0; i < argomenti.length; i++) {
  const arg = argomenti[i];
  if (!arg) continue;
  const barzelletta = await generatoreDiBarzellette(arg);
  barzellette.push(barzelletta.trim());
  if (i < argomenti.length - 1) {
    // Aspetta 1 secondo prima della prossima barzelletta (tranne dopo l'ultima)
    await Bun.sleep(1000);
  }
}

console.log("Barzellette generate:", barzellette);

