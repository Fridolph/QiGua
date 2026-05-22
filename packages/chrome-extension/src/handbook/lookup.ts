import { hexagrams, trigrams } from "../data/trigrams";
import type { Hexagram } from "./types";

const byTrigrams = new Map<string, Hexagram>();
const byBinary = new Map<string, Hexagram>();

export function initLookup(): void {
  if (byTrigrams.size > 0) return;
  for (const h of hexagrams) {
    byTrigrams.set(`${h.upper}-${h.lower}`, h);
    byBinary.set(h.binary, h);
  }
}

export function lookupByTrigrams(upper: number, lower: number): Hexagram | undefined {
  initLookup();
  return byTrigrams.get(`${upper}-${lower}`);
}

export function lookupByBinary(binary: string): Hexagram | undefined {
  initLookup();
  return byBinary.get(binary);
}

export function getTrigrams() {
  return trigrams;
}
