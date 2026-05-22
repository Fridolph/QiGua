import { Solar } from "lunar-typescript";
import { BRANCH_NAMES } from "../data/trigrams";

export const branchToIndex = (zhi: string): number => {
  const idx = BRANCH_NAMES.indexOf(zhi as typeof BRANCH_NAMES[number]);
  return idx >= 0 ? idx + 1 : 1;
};

export type TimeResult = {
  method: "time";
  source: "lunar" | "approx";
  year: number;
  yearBranch: number;
  yearBranchName: string;
  month: number;
  monthBranchName?: string;
  day: number;
  hour: number;
  hourBranch: number;
  hourBranchName: string;
  upper: number;
  lower: number;
  changingLine: number;
};

export function divineByTime(date?: Date): TimeResult {
  const d = date || new Date();

  try {
    return divineByLunar(d);
  } catch {
    return divineByApprox(d);
  }
}

function divineByLunar(d: Date): TimeResult {
  const solar = Solar.fromDate(d);
  const lunar = solar.getLunar();

  const yearZhi = lunar.getYearZhiByLiChun();
  const yearBranch = branchToIndex(yearZhi);

  const monthZhi = lunar.getMonthZhi();
  const monthBranch = branchToIndex(monthZhi);
  const monthNum = ((monthBranch - 3 + 12) % 12) + 1;

  const dayNum = lunar.getDay();
  const hour = d.getHours();
  const hourBranch = Math.floor(((hour + 1) % 24) / 2) + 1;

  const upperNum = (yearBranch + monthNum + dayNum) % 8 || 8;
  const lowerNum = (yearBranch + monthNum + dayNum + hourBranch) % 8 || 8;
  const changingLine = (yearBranch + monthNum + dayNum + hourBranch) % 6 || 6;

  return {
    method: "time",
    source: "lunar",
    year: d.getFullYear(),
    yearBranch,
    yearBranchName: yearZhi,
    month: monthNum,
    monthBranchName: monthZhi,
    day: dayNum,
    hour,
    hourBranch,
    hourBranchName: BRANCH_NAMES[hourBranch - 1],
    upper: upperNum,
    lower: lowerNum,
    changingLine,
  };
}

function divineByApprox(d: Date): TimeResult {
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();

  const yearBranch = ((year - 4) % 12) + 1;
  const hourBranch = Math.floor(((hour + 1) % 24) / 2) + 1;

  const upperNum = (yearBranch + month + day) % 8 || 8;
  const lowerNum = (yearBranch + month + day + hourBranch) % 8 || 8;
  const changingLine = (yearBranch + month + day + hourBranch) % 6 || 6;

  return {
    method: "time",
    source: "approx",
    year,
    yearBranch,
    yearBranchName: BRANCH_NAMES[yearBranch - 1],
    month,
    day,
    hour,
    hourBranch,
    hourBranchName: BRANCH_NAMES[hourBranch - 1],
    upper: upperNum,
    lower: lowerNum,
    changingLine,
  };
}
