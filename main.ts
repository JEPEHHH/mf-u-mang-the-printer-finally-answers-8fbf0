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

/**
 * Resolve the writable output directory. The grader exports this from its
 * /output mount; a local run may point it anywhere. The fallback keeps the
 * documented /output/entry.txt path working with no configuration.
 */
function resolveOutputDirectory(): string {
  return process.env.MAKEFUN_OUTPUT_DIR || FALLBACK_OUTPUT_DIR;
}

/** Count Unicode code points, matching the gate's "characters" wording. */
function charCount(text: string): number {
  return Array.from(text).length;
}

/**
 * Fail fast if the line cannot pass the gate: it must be non-blank and within
 * the permitted character range. Keeping this separate makes the rule backed
 * by named limits instead of an inline byte check.
 */
function assertGateReady(text: string): void {
  const count = charCount(text);
  if (count < MIN_LENGTH) {
    throw new Error(`entry line is empty (need at least ${MIN_LENGTH} character)`);
  }
  if (count > MAX_LENGTH) {
    throw new Error(`entry line has ${count} characters, over the ${MAX_LENGTH} limit`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry line is only whitespace");
  }
}

/** Write the comeback line and report the exact artifact written. */
function main(): void {
  assertGateReady(COMEBACK);
  const directory = resolveOutputDirectory();
  mkdirSync(directory, { recursive: true });
  const path = join(directory, ARTIFACT_NAME);
  writeFileSync(path, COMEBACK, "utf8");
  const bytes = Buffer.byteLength(COMEBACK, "utf8");
  process.stdout.write(`wrote ${path}: ${charCount(COMEBACK)} chars / ${bytes} bytes\n`);
}

main();
