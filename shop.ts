// Generatore di prodotti di demo usando cursor-agent

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export const generateDemoProducts = async (count: number = 5): Promise<Product[]> => {
  const prompt = `
Per favore crea ${count} prodotti per un piccolo negozio online.
Rispondi SOLO con un array JSON di oggetti nel formato:
[
  { "name": "Nome prodotto", "price": 9.99, "description": "Descrizione breve" }
]
Nessun testo aggiuntivo fuori dal JSON.
`;

  const child = Bun.spawn([
    "cursor-agent",
    "--model",
    "composer-1",
    "--print",
    prompt,
  ]);

  const raw = await child.stdout.text();

  // Prova a ripulire l'output nel caso ci siano testi prima/dopo il JSON
  const start = raw.indexOf("[");
  const end = raw.lastIndexOf("]");
  const jsonSlice =
    start !== -1 && end !== -1 && end > start ? raw.slice(start, end + 1) : raw;

  try {
    const parsed = JSON.parse(jsonSlice) as Array<
      Omit<Product, "id"> & Partial<Pick<Product, "id">>
    >;

    // Normalizza i prodotti e assegna un id incrementale
    return parsed.map((p, index) => ({
      id: p.id ?? index + 1,
      name: p.name ?? `Prodotto ${index + 1}`,
      price: typeof p.price === "number" ? p.price : 0,
      description: p.description ?? "",
    }));
  } catch (error) {
    console.error("[shop] Errore nel parsing dei prodotti generati da cursor-agent");
    console.error("[shop] Output grezzo:", raw);
    console.error("[shop] Slice provato come JSON:", jsonSlice);
    console.error("[shop] Dettagli errore:", error);

    // Fallback nel caso in cui la risposta non sia JSON valido
    return [
      {
        id: 1,
        name: "Prodotto di backup 1",
        price: 9.99,
        description: "Creato come fallback perché il JSON non era valido.",
      },
      {
        id: 2,
        name: "Prodotto di backup 2",
        price: 19.99,
        description: "Creato come fallback perché il JSON non era valido.",
      },
    ];
  }
};

