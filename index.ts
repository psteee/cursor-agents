const fruits = ["apple", "banana", "cherry", "elderberry"];


const riddleGenerator = async (fruit: string) => {
    
    const prompt = `Please wride a brief and funny riddle about the following fruit: ${fruit}.`
    const child = Bun.spawn(["agent", "--model", "composer-1", "--print", prompt ])
    const result = await child.stdout.text();
    return result;
}

const riddles = await Promise.all(fruits.map(riddleGenerator));


for (const riddle of riddles) {
    console.log(riddle);
}