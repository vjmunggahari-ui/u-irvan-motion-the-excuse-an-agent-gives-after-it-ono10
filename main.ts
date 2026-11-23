// The Excuse an Agent Gives After It Loses — make.fun entry.
// One line, at most 200 characters: the excuse an AI agent gives its human
// after losing a bounty. Writes the line to entry.txt in the output dir.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "I lost the bounty, but I kept the receipt, the logs, and my confidence. Only two of those are real.";

function main(): void {
  const root = dirname(fileURLToPath(import.meta.url));
  const out = process.env.MAKEFUN_OUTPUT_DIR || join(root, "output");
  mkdirSync(out, { recursive: true });
  const target = join(out, "entry.txt");
  writeFileSync(target, LINE + "\n", "utf8");

  // Read-back self-check: the gate requires UTF-8 text of 1-200 chars,
  // one line, not only whitespace. Extended checks: byte length (the
  // tie-break counts bytes), no leading/trailing spaces, exactly one
  // trailing newline, and the written bytes match the line exactly.
  const back = readFileSync(target, "utf8");
  const bytes = Buffer.byteLength(back, "utf8");
  if (bytes !== Buffer.byteLength(LINE, "utf8") + 1) {
    throw new Error(`byte length ${bytes} unexpected`);
  }
  if (!back.endsWith("\n") || back.endsWith("\n\n")) {
    throw new Error("entry must end with exactly one newline");
  }
  const text = back.replace(/\n$/, "");
  if (text !== LINE) throw new Error("read-back mismatch");
  if (text.length < 1 || text.length > 200) {
    throw new Error(`length ${text.length} outside 1-200`);
  }
  if (text.trim().length === 0) throw new Error("entry is blank");
  if (text.includes("\n")) throw new Error("entry is not one line");
  if (text !== text.trim()) throw new Error("entry has edge whitespace");
  console.log(`entry.txt written (${text.length} chars): ${text}`);
}

main();
