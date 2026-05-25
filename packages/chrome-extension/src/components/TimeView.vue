<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Solar } from "lunar-typescript";
import { divineByTime } from "../handbook";
import type { TimeResult } from "../handbook";

const emit = defineEmits<{
  divine: [dr: TimeResult];
}>();

const now = ref(new Date());
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => { now.value = new Date(); }, 1000);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const pad = (n: number) => String(n).padStart(2, "0");

const gregorian = () => {
  const d = now.value;
  return `${d.getFullYear()}年${pad(d.getMonth() + 1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const lunarDisplay = () => {
  const dr = divineByTime(now.value);
  try {
    const solar = Solar.fromDate(now.value);
    const lunar = solar.getLunar();
    const yearGZ = lunar.getYearInGanZhiByLiChun();
    const monthZhi = lunar.getMonthZhi();
    const monthNum = lunar.getMonth();
    const absMonth = Math.abs(monthNum);
    const dayNum = lunar.getDay();

    return {
      year: { label: yearGZ, num: dr.yearBranch },
      month: { label: `${monthZhi}月 (${absMonth}月)`, num: dr.month },
      day: { label: `农历${dayNum}`, num: dr.day },
      hour: { label: `${dr.hourBranchName}时`, num: dr.hourBranch },
    };
  } catch {
    return {
      year: { label: `${dr.yearBranchName}年`, num: dr.yearBranch },
      month: { label: `${dr.month}月`, num: dr.month },
      day: { label: `${dr.day}日`, num: dr.day },
      hour: { label: `${dr.hourBranchName}时`, num: dr.hourBranch },
    };
  }
};

const formulaData = () => {
  const dr = divineByTime(now.value);
  const sum3 = dr.yearBranch + dr.month + dr.day;
  const sum4 = dr.yearBranch + dr.month + dr.day + dr.hourBranch;
  const rawUpper = sum3 % 8;
  const rawLower = sum4 % 8;
  const rawLine = sum4 % 6;

  return {
    upper: { yearBranch: dr.yearBranch, month: dr.month, day: dr.day, sum: sum3, raw: rawUpper, result: rawUpper || 8 },
    lower: { yearBranch: dr.yearBranch, month: dr.month, day: dr.day, hourBranch: dr.hourBranch, sum: sum4, raw: rawLower, result: rawLower || 8 },
    moving: { yearBranch: dr.yearBranch, month: dr.month, day: dr.day, hourBranch: dr.hourBranch, sum: sum4, raw: rawLine, result: rawLine || 6 },
  };
};

function runDivination() {
  emit("divine", divineByTime(now.value));
}
</script>

<template>
  <div class="time-view">
    <div class="gregorian-row">
      <span class="gregorian-time">{{ gregorian() }}</span>
    </div>

    <div class="lunar-grid">
      <div class="lunar-row">
        <span class="lunar-label">年</span>
        <span class="lunar-value">{{ lunarDisplay().year.label }}</span>
        <span class="lunar-num">{{ lunarDisplay().year.num }}</span>
      </div>
      <div class="lunar-row">
        <span class="lunar-label">月</span>
        <span class="lunar-value">{{ lunarDisplay().month.label }}</span>
        <span class="lunar-num">{{ lunarDisplay().month.num }}</span>
      </div>
      <div class="lunar-row">
        <span class="lunar-label">日</span>
        <span class="lunar-value">{{ lunarDisplay().day.label }}</span>
        <span class="lunar-num">{{ lunarDisplay().day.num }}</span>
      </div>
      <div class="lunar-row">
        <span class="lunar-label">时辰</span>
        <span class="lunar-value">{{ lunarDisplay().hour.label }}</span>
        <span class="lunar-num">{{ lunarDisplay().hour.num }}</span>
      </div>
    </div>

    <div class="formula-grid">
      <div class="formula-row">
        <span>上卦 (年{{ formulaData().upper.yearBranch }} + 月{{ formulaData().upper.month }} + 日{{ formulaData().upper.day }}) ÷ 8 → 余{{ formulaData().upper.raw === 0 ? 0 : formulaData().upper.raw }}取<span class="formula-result">{{ formulaData().upper.result }}</span></span>
      </div>
      <div class="formula-row">
        <span>下卦 (年{{ formulaData().lower.yearBranch }} + 月{{ formulaData().lower.month }} + 日{{ formulaData().lower.day }} + 时{{ formulaData().lower.hourBranch }}) ÷ 8 → 余{{ formulaData().lower.raw === 0 ? 0 : formulaData().lower.raw }}取<span class="formula-result">{{ formulaData().lower.result }}</span></span>
      </div>
      <div class="formula-row">
        <span>动爻 (年{{ formulaData().moving.yearBranch }} + 月{{ formulaData().moving.month }} + 日{{ formulaData().moving.day }} + 时{{ formulaData().moving.hourBranch }}) ÷ 6 → 余{{ formulaData().moving.raw === 0 ? 0 : formulaData().moving.raw }}取<span class="formula-result">{{ formulaData().moving.result }}</span></span>
      </div>
    </div>

    <button class="divine-btn" @click="runDivination">
      查看结果
    </button>
  </div>
</template>

<style scoped>
.time-view {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 6px 0;
}

.gregorian-row {
  text-align: center;
  padding: 14px 0;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
}

.gregorian-time {
  font-size: 20px;
  font-weight: 800;
  color: oklch(0.18 0.02 40);
  font-variant-numeric: tabular-nums;
}

.lunar-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: oklch(0.97 0.008 67.78);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
  overflow: hidden;
}

.lunar-row {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 12px;
}

.lunar-row:not(:last-child) {
  border-bottom: 1px solid oklch(0.905 0.015 55 / 0.5);
}

.lunar-label {
  width: 36px;
  font-size: 14px;
  font-weight: 700;
  color: oklch(0.52 0.03 40);
  flex-shrink: 0;
}

.lunar-value {
  flex: 1;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  color: #b54433;
}

.lunar-num {
  width: 28px;
  text-align: center;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 700;
  color: oklch(0.18 0.02 40);
  flex-shrink: 0;
}

.formula-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
}

.formula-row {
  font-size: 16px;
  color: oklch(0.45 0.03 40);
  line-height: 1.6;
  font-family: "SF Mono", "Menlo", "Consolas", monospace;
}

.formula-result {
  font-weight: 800;
  color: #b54433;
}

.divine-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #b54433;
  color: #fff;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3em;
  cursor: pointer;
  transition: opacity 130ms, transform 100ms;
  margin-top: 16px;
}

.divine-btn:hover { opacity: 0.85; }
.divine-btn:active { transform: scale(0.97); }
</style>
