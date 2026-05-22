import { trigrams } from "../data/trigrams";
import type { Hexagram } from "./types";
import { lookupByBinary } from "./lookup";

const WUXING_GENERATES: Record<string, string> = {
  "木": "火", "火": "土", "土": "金", "金": "水", "水": "木"
};

const WUXING_CONTROLS: Record<string, string> = {
  "木": "土", "土": "水", "水": "火", "火": "金", "金": "木"
};

export type BodyUseAnalysis = {
  body: { num: number; name: string; symbol: string; element: string; nature: string };
  use: { num: number; name: string; symbol: string; element: string; nature: string };
  relation: string;
  judgment: string;
  level: string;
  description: string;
};

export function computeChangedHexagram(binary: string, changingLine: number): Hexagram | undefined {
  const pos = changingLine - 1;
  const arr = binary.split("");
  arr[pos] = arr[pos] === "1" ? "0" : "1";
  return lookupByBinary(arr.join(""));
}

export function getBodyUseAnalysis(hexagram: Hexagram, changingLine: number): BodyUseAnalysis {
  let bodyNum: number, useNum: number;
  if (changingLine >= 1 && changingLine <= 3) {
    bodyNum = hexagram.upper;
    useNum = hexagram.lower;
  } else {
    bodyNum = hexagram.lower;
    useNum = hexagram.upper;
  }

  const bodyTri = trigrams[bodyNum];
  const useTri = trigrams[useNum];
  const bodyEl = bodyTri.element;
  const useEl = useTri.element;

  let relation: string, judgment: string, level: string, description: string;

  if (WUXING_GENERATES[useEl] === bodyEl) {
    relation = "用生体"; judgment = "吉"; level = "✅";
    description = "外事生助自身，万事顺遂，适宜积极推进";
  } else if (WUXING_GENERATES[bodyEl] === useEl) {
    relation = "体生用"; judgment = "耗"; level = "⚠️";
    description = "自身消耗于外，宜守不宜攻，减少精力投入";
  } else if (WUXING_CONTROLS[bodyEl] === useEl) {
    relation = "体克用"; judgment = "小吉"; level = "👍";
    description = "自身克制外事，可成但需付出较多努力";
  } else if (WUXING_CONTROLS[useEl] === bodyEl) {
    relation = "用克体"; judgment = "凶"; level = "❌";
    description = "外事克制自身，诸事不宜，建议暂缓或小心行事";
  } else {
    relation = "体用同"; judgment = "平"; level = "⚖️";
    description = "内外五行一致，平稳发展，顺势而为";
  }

  return {
    body: { num: bodyNum, name: bodyTri.name, symbol: bodyTri.symbol, element: bodyEl, nature: bodyTri.nature },
    use: { num: useNum, name: useTri.name, symbol: useTri.symbol, element: useEl, nature: useTri.nature },
    relation, judgment, level, description
  };
}
