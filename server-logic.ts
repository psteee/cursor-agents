// FILE: server-logic.ts
import type { Product } from "./shop";
import { generateProducts } from "./shop";

export const port = 3000;

const products: Product[] = await generateProducts(5);
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

    try {
      // GET /api/products → lista prodotti
      if (pathname === "/api/products" && method === "GET") {
        return jsonResponse(products);
      }

      // POST /api/products → crea prodotto
      if (pathname === "/api/products" && method === "POST") {
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
      }

      // Rotte con id: /api/products/:id
      if (pathname.startsWith("/api/products/")) {
        const idPart = pathname.replace("/api/products/", "");
        if (!/^[0-9]+$/.test(idPart)) {
          return jsonResponse({ error: "ID non valido" }, { status: 400 });
        }
        const id = Number(idPart);
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

      // GET /hello/hello world
      if (pathname === "/hello/hello world" && method === "GET") {
        return new Response("hello world", {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      // 404 fallback
      return jsonResponse({ error: "Not found" }, { status: 404 });
    } catch (error) {
      console.error("[server-logic] Errore:", error);
      return jsonResponse(
        { error: "Errore interno del server" },
        { status: 500 }
      );
    }
  };
}
