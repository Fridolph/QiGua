<script setup lang="ts">
import { ref, computed } from "vue";
import { Solar } from "lunar-typescript";
import { divineByTime } from "../handbook";
import type { TimeResult } from "../handbook";

const emit = defineEmits<{
  divine: [dr: TimeResult];
}>();

const timeData = computed(() => {
  const now = new Date();
  const dr = divineByTime(now);

  let lunarInfo = "";
  try {
    const solar = Solar.fromDate(now);
    const lunar = solar.getLunar();
    const yearGZ = lunar.getYearInGanZhiByLiChun();
    const monthZhi = lunar.getMonthZhi();
    const lunarDay = lunar.getDay();
    const lunarMonth = lunar.getMonth();
    const hourZhi = dr.hourBranchName;
    lunarInfo = `${yearGZ}年 ${monthZhi}月 农历${lunarDay}日 ${hourZhi}时`;
  } catch {
    lunarInfo = `${dr.yearBranchName}年 ${dr.month}月 ${dr.day}日 ${dr.hourBranchName}时 (近似)`;
  }

  return { dr, lunarInfo };
});

const gregorian = computed(() => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}年${pad(now.getMonth() + 1)}月${pad(now.getDate())}日 ${pad(now.getHours())}:${pad(now.getMinutes())}`;
});

function runDivination() {
  emit("divine", timeData.value.dr);
}
</script>

<template>
  <div class="time-view">
    <div class="time-display">
      <div class="time-gregorian">{{ gregorian }}</div>
      <div class="time-lunar">
          <span class="lunar-text">{{ timeData.lunarInfo }}</span>
        <span class="lunar-nums">
          上卦{{ timeData.dr.upper }} · 下卦{{ timeData.dr.lower }} · 动{{ timeData.dr.changingLine }}爻
        </span>
      </div>
    </div>

    <button class="divine-btn" @click="runDivination">
      起 卦
    </button>
  </div>
</template>

<style scoped>
.time-view {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 6px 0;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-gregorian {
  font-size: 14px;
  font-weight: 600;
  color: oklch(0.18 0.02 40);
  text-align: center;
  padding: 10px 0;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
}

.time-lunar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 10px 0;
  background: oklch(0.97 0.008 67.78);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
}

.lunar-text {
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 14px;
  font-weight: 700;
  color: #b54433;
}

.lunar-nums {
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 12px;
  font-weight: 600;
  color: #b54433;
  opacity: 0.8;
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
}

.divine-btn:hover { opacity: 0.85; }
.divine-btn:active { transform: scale(0.97); }
</style>
