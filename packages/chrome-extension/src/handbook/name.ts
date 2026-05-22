import { strokes } from "../data/strokes";

export type NameResult = {
  method: "name";
  text: string;
  chars: string[];
  strokes: number[];
  totalStrokes: number;
  upper: number;
  lower: number;
  changingLine: number;
};

export function divineByName(text: string): NameResult | null {
  if (!text?.trim()) return null;

  const str = text.trim();
  const chars = [...str]; // handles multi-byte chars correctly
  const charStrokes = chars.map(ch => strokes[ch] ?? estimateStrokes(ch));
  const totalStrokes = charStrokes.reduce((a, b) => a + b, 0);

  let upperStrokes: number, lowerStrokes: number;

  if (chars.length === 1) {
    upperStrokes = charStrokes[0];
    lowerStrokes = charStrokes[0] + 1;
  } else {
    const mid = Math.ceil(chars.length / 2);
    upperStrokes = charStrokes.slice(0, mid).reduce((a, b) => a + b, 0);
    lowerStrokes = charStrokes.slice(mid).reduce((a, b) => a + b, 0);
  }

  if (lowerStrokes === 0) lowerStrokes = upperStrokes;

  const upper = upperStrokes % 8 || 8;
  const lower = lowerStrokes % 8 || 8;
  const changingLine = totalStrokes % 6 || 6;

  return {
    method: "name",
    text: str,
    chars,
    strokes: charStrokes,
    totalStrokes,
    upper,
    lower,
    changingLine,
  };
}

function estimateStrokes(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) return 6 + (code % 15);
  if (code >= 0x3400 && code <= 0x4DBF) return 8 + (code % 15);
  return ch.length;
}
