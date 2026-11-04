// Lists image slots from src/data/images.ts that don't yet have /public/images/<slot>.webp
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const src = fs.readFileSync(path.join(root, "src/data/images.ts"), "utf8");
const ids = [...src.matchAll(/^\s*"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]);
const dir = path.join(root, "public/images");
const have = new Set(fs.existsSync(dir) ? fs.readdirSync(dir) : []);
const missing = ids.filter((id) => !have.has(`${id}.webp`));
console.log(`\nMatcha Babe image slots: ${ids.length - missing.length}/${ids.length} present\n`);
for (const id of ids) console.log(`${have.has(`${id}.webp`) ? "  ✓" : "  ✗"} ${id}.webp`);
if (missing.length) console.log(`\n${missing.length} missing → drop files into public/images/ (see IMAGE_BRIEF.md)\n`);
