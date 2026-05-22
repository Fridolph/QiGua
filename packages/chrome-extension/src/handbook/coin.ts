export type CoinTossDetail = {
  coins: number[];
  heads: number;
  value: number;
  type: string;
};

export type CoinResult = {
  method: "coin";
  lines: number[];
  tossDetails: CoinTossDetail[];
  binary: string;
  changedBinary: string;
  changingPositions: number[];
  isStatic: boolean;
};

export function divineByCoin(): CoinResult {
  const lines: number[] = [];
  const changingPositions: number[] = [];
  const tossDetails: CoinTossDetail[] = [];

  for (let i = 0; i < 6; i++) {
    const t1 = Math.random() < 0.5 ? 0 : 1;
    const t2 = Math.random() < 0.5 ? 0 : 1;
    const t3 = Math.random() < 0.5 ? 0 : 1;
    const heads = t1 + t2 + t3;

    let value: number, type: string;
    if (heads === 3)      { value = 9; type = "老阳"; }
    else if (heads === 2) { value = 8; type = "少阴"; }
    else if (heads === 1) { value = 7; type = "少阳"; }
    else                  { value = 6; type = "老阴"; }

    lines.push(value);
    tossDetails.push({ coins: [t1, t2, t3], heads, value, type });

    if (value === 6 || value === 9) changingPositions.push(i + 1);
  }

  const binary = lines.map(v => (v === 9 || v === 7) ? "1" : "0").join("");
  const changedBinary = lines.map(v => {
    if (v === 9) return "0";
    if (v === 6) return "1";
    return (v === 7) ? "1" : "0";
  }).join("");

  return {
    method: "coin",
    lines,
    tossDetails,
    binary,
    changedBinary,
    changingPositions,
    isStatic: changingPositions.length === 0,
  };
}
