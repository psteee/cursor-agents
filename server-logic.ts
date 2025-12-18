// Logica del server di demo, separata dall'entrypoint
// Ora il server finge di essere un piccolo negozio online.
// Include esempi di GET, POST, PUT e DELETE su /api/products.

import type { Product } from "./shop";
import { generateDemoProducts } from "./shop";

export const port = 3000;

// Piccolo "database" in memoria solo per la demo, popolato usando cursor-agent
const products: Product[] = await generateDemoProducts();
let nextId = products.length + 1;

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

export function createFetchHandler() {
  return async function fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const { pathname } = url;
    const method = req.method.toUpperCase();

    // Home semplice
    if (pathname === "/" && method === "GET") {
      return new Response(
        "Ciao! Questo è il server di demo con Bun.serve().\n" +
          "Prova le rotte:\n" +
          "GET  /hello?name=Action\n" +
          "GET  /api/products\n" +
          "GET  /api/products/:id\n" +
          "POST /api/products\n" +
          "PUT  /api/products/:id\n" +
          "DELETE /api/products/:id\n"
      );
    }

    // Demo GET con querystring
    if (pathname === "/hello" && method === "GET") {
      const name = url.searchParams.get("name") ?? "mondo";
      return new Response(`Ciao, ${name}!`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // --- API DEMO /api/products ---

    // GET /api/products → lista prodotti
    if (pathname === "/api/products" && method === "GET") {
      return jsonResponse(products);
    }

    // POST /api/products → crea prodotto
    if (pathname === "/api/products" && method === "POST") {
      try {
        const body = (await req.json()) as Partial<Product>;
        if (!body.name || typeof body.price !== "number") {
          return jsonResponse(
            { error: "Campi 'name' (string) e 'price' (number) richiesti" },
            { status: 400 }
          );
        }
        const newProduct: Product = {
          id: nextId++,
          name: body.name,
          price: body.price,
          description: body.description ?? "",
        };
        products.push(newProduct);
        return jsonResponse(newProduct, { status: 201 });
      } catch {
        return jsonResponse({ error: "JSON non valido" }, { status: 400 });
      }
    }

    // Rotte con id: /api/products/:id
    if (pathname.startsWith("/api/products/")) {
      const idPart = pathname.replace("/api/products/", "");
      const id = Number(idPart);
      if (!Number.isFinite(id)) {
        return jsonResponse({ error: "ID non valido" }, { status: 400 });
      }

      const productIndex = products.findIndex((p) => p.id === id);
      const product = products[productIndex];

      // GET /api/products/:id
      if (method === "GET") {
        if (!product) {
          return jsonResponse(
            { error: "Prodotto non trovato" },
            { status: 404 }
          );
        }
        return jsonResponse(product);
      }

      // PUT /api/products/:id → aggiorna prodotto
      if (method === "PUT") {
        if (!product) {
          return jsonResponse(
            { error: "Prodotto non trovato" },
            { status: 404 }
          );
        }
        try {
          const body = (await req.json()) as Partial<Product>;
          if (!body.name || typeof body.price !== "number") {
            return jsonResponse(
              { error: "Campi 'name' (string) e 'price' (number) richiesti" },
              { status: 400 }
            );
          }
          product.name = body.name;
          product.price = body.price;
          product.description = body.description ?? product.description;
          return jsonResponse(product);
        } catch {
          return jsonResponse({ error: "JSON non valido" }, { status: 400 });
        }
      }

      // DELETE /api/products/:id
      if (method === "DELETE") {
        if (productIndex === -1) {
          return jsonResponse(
            { error: "Prodotto non trovato" },
            { status: 404 }
          );
        }
        products.splice(productIndex, 1);
        return new Response(null, { status: 204 });
      }
    }

    // 404 fallback
    return new Response("Not found", { status: 404 });
  };
}

