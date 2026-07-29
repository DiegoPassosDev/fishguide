import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, "..", "generated", "prisma", "client.ts");

const content = readFileSync(clientPath, "utf-8");

const patched = content
  .replace(
    `import * as process from 'node:process'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))`,
    `globalThis['__dirname'] = __dirname`,
  );

writeFileSync(clientPath, patched, "utf-8");
console.log("✅ Prisma generated client patched for CJS compatibility");
