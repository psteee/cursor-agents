const fruits = ["apple", "banana", "cherry"];

const riddleGenerator = async ( fruit: string ) => {
  const prompt = ` Per favore dimmi un'indovinello di logica con la seguente frutta: ${fruit} `;
  const child = Bun.spawn(["cursor-agent", "--model", "composer-1", "--print", prompt]);
  const result = await child.stdout.text();  
  return result;
}

const riddles = await Promise.all(fruits.map(riddleGenerator));
console.log(riddles);

