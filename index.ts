const child = Bun.spawn(["agent", "--model", "composer-1", "--print", "Please write a readme for this project and fill it with some generic details about the project." ])

const result = await child.stdout.text();

console.log(result);