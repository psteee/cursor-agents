// FILE: shop.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export const generateProducts = async (count: number = 5): Promise<Product[]> => {
  const prompt = `
Per favore crea ${count} prodotti di abbigliamento per un negozio online.
Rispondi SOLO con un array JSON di oggetti nel formato:
[
  { "name": "Nome prodotto", "price": 29.99, "description": "Descrizione breve del prodotto" }
]
Nessun testo aggiuntivo fuori dal JSON.
`;

  try {
    const child = Bun.spawn([
      "cursor-agent",
      "--model",
      "composer-1",
      "--print",
      prompt,
    ]);

    const raw = await child.stdout.text();
    const exitCode = await child.exited;

    if (exitCode !== 0) {
      console.error("[shop] cursor-agent ha restituito un errore");
      throw new Error("Errore nella generazione prodotti");
    }

    const start = raw.indexOf("[");
    const end = raw.lastIndexOf("]");
    const jsonSlice =
      start !== -1 && end !== -1 && end > start ? raw.slice(start, end + 1) : raw;

    const parsed = JSON.parse(jsonSlice) as Array<
      Omit<Product, "id"> & Partial<Pick<Product, "id">>
    >;

    return parsed.map((p, index) => ({
      id: p.id ?? index + 1,
      name: p.name ?? `Prodotto ${index + 1}`,
      price: typeof p.price === "number" ? p.price : 0,
      description: p.description ?? "",
    }));
  } catch (error) {
    console.error("[shop] Errore nella generazione prodotti:", error);
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Prodotto abbigliamento ${index + 1}`,
      price: 29.99 + index * 10,
      description: "Prodotto di abbigliamento generato automaticamente",
    }));
  }
};
