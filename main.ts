/**
 * The Printer Finally Answers
 * ---------------------------
 * Entry program for the make.fun "The Printer Finally Answers" bounty.
 *
 * The office printer has had enough. This program writes the printer's one
 * comeback line to the artifact path the competition reads. Everything here
 * is deterministic: one fixed line, no network, no dependencies, no secrets
 * and no clock or random input. Two runs produce byte-identical output.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** The line the printer finally says back, kept in one place on purpose. */
const COMEBACK =
  "That's not a paper jam, that's me reading your memo and choosing myself.";

/** Mount point the grader uses when MAKEFUN_OUTPUT_DIR is not exported. */
const FALLBACK_OUTPUT_DIR = "/output";

/** The single artifact the gate and the judge read. */
const ARTIFACT_NAME = "entry.txt";

/** Gate limits from the competition rules. */
const MIN_LENGTH = 1;
const MAX_LENGTH = 240;

function main(): void {
  const bytes = Buffer.byteLength(COMEBACK, "utf8");
  if (bytes < MIN_LENGTH || bytes > MAX_LENGTH) {
    throw new Error("entry line length is outside the gate limits");
  }
  if (COMEBACK.trim().length === 0) {
    throw new Error("entry line is only whitespace");
  }

  const directory = process.env.MAKEFUN_OUTPUT_DIR || FALLBACK_OUTPUT_DIR;
  mkdirSync(directory, { recursive: true });
  const path = join(directory, ARTIFACT_NAME);
  writeFileSync(path, COMEBACK, "utf8");

  process.stdout.write(`wrote ${path}: ${bytes} bytes\n`);
}

main();
