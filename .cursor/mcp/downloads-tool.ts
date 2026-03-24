import { tool, z } from "mcpez";
import path from "node:path";
import { readdir, stat } from "node:fs/promises";

function downloadsRoot(): string {
  const home = Bun.env.HOME ?? Bun.env.USERPROFILE;
  if (!home) {
    throw new Error("Could not resolve home directory (HOME / USERPROFILE unset)");
  }
  return path.join(home, "Downloads");
}

async function collectFiles(root: string, recursive: boolean): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (recursive) await walk(full);
      } else {
        files.push(full);
      }
    }
  }
  await walk(root);
  return files;
}

tool(
  "read_downloads_folder",
  {
    description:
      "List or read text contents of files in the user's Downloads folder (macOS/Linux: ~/Downloads, Windows: %USERPROFILE%\\Downloads). Use action=list first; read is capped per file to avoid huge payloads.",
    inputSchema: {
      action: z
        .enum(["list", "read_all"])
        .describe('list: paths + sizes only; read_all: UTF-8 text per file (skips unreadable/binary)'),
      recursive: z
        .boolean()
        .optional()
        .describe("Include subfolders (default false)"),
      maxFiles: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Max files to process (default 100 for list, 30 for read_all)"),
      maxBytesPerFile: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Max bytes read per file for read_all (default 50_000)"),
    },
  }, 
  async ({ action, recursive = false, maxFiles, maxBytesPerFile }) => {
    const root = downloadsRoot();
    const st = await stat(root).catch(() => null);
    if (!st?.isDirectory()) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "Downloads folder not found", path: root }, null, 2),
          },
        ],
      };
    }

    const files = await collectFiles(root, recursive);
    files.sort((a, b) => a.localeCompare(b));

    const defaultMax = action === "list" ? 100 : 30;
    const limit = maxFiles ?? defaultMax;
    const slice = files.slice(0, limit);
    const truncated = files.length > limit;

    if (action === "list") {
      const rows: { path: string; relativePath: string; size: number }[] = [];
      for (const f of slice) {
        const s = await stat(f).catch(() => null);
        if (s?.isFile()) {
          rows.push({
            path: f,
            relativePath: path.relative(root, f),
            size: s.size,
          });
        }
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                downloadsRoot: root,
                totalFiles: files.length,
                returned: rows.length,
                truncated,
                files: rows,
              },
              null,
              2,
            ),
          },
        ],
      };
    }

    const maxBytes = maxBytesPerFile ?? 50_000;
    const contents: { path: string; relativePath: string; text: string; truncated: boolean }[] = [];

    for (const f of slice) {
      const s = await stat(f).catch(() => null);
      if (!s?.isFile()) continue;

      const file = Bun.file(f);
      const size = file.size;
      if (size > maxBytes) {
        contents.push({
          path: f,
          relativePath: path.relative(root, f),
          text: `[skipped: file larger than maxBytesPerFile (${size} > ${maxBytes})]`,
          truncated: true,
        });
        continue;
      }

      try {
        const buf = await file.arrayBuffer();
        const sliceBuf = buf.byteLength > maxBytes ? buf.slice(0, maxBytes) : buf;
        const text = new TextDecoder("utf-8", { fatal: false }).decode(sliceBuf);
        const hasNul = text.includes("\0");
        contents.push({
          path: f,
          relativePath: path.relative(root, f),
          text: hasNul ? "[skipped: appears binary (null bytes)]" : text,
          truncated: buf.byteLength > maxBytes,
        });
      } catch {
        contents.push({
          path: f,
          relativePath: path.relative(root, f),
          text: "[skipped: could not read file]",
          truncated: false,
        });
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              downloadsRoot: root,
              totalFiles: files.length,
              returned: contents.length,
              truncatedList: truncated,
              maxBytesPerFile: maxBytes,
              files: contents,
            },
            null,
            2,
          ),
        },
      ],
    };
  },
);
