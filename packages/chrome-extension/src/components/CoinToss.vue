<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { divineByCoin, lookupByBinary, getBodyUseAnalysis } from "../handbook";
import type { CoinResult, CoinTossDetail, Hexagram, BodyUseAnalysis } from "../handbook";

const emit = defineEmits<{
  complete: [dr: CoinResult, hexagram: Hexagram, analysis: BodyUseAnalysis | null, changed: Hexagram | undefined];
}>();

const tossCount = ref(0);
const details = reactive<CoinTossDetail[]>([]);
let storedDr: CoinResult | null = null;

const POS_LABELS = ["初", "二", "三", "四", "五", "上"];

function lineClass(v: number) {
  if (v === 9) return "line-old-yang";
  if (v === 7) return "line-young-yang";
  if (v === 6) return "line-old-yin";
  return "line-young-yin";
}

function doToss() {
  if (tossCount.value >= 6) return;
  if (tossCount.value === 0) storedDr = divineByCoin();
  if (!storedDr) return;
  const detail = storedDr.tossDetails[tossCount.value];
  details.push(detail);
  tossCount.value++;
}

function reveal() {
  if (!storedDr || tossCount.value < 6) return;
  const hexagram = lookupByBinary(storedDr.binary);
  if (!hexagram) return;
  const changingLine = storedDr.changingPositions.length > 0
    ? storedDr.changingPositions[0] : null;
  const analysis = changingLine
    ? getBodyUseAnalysis(hexagram, changingLine) : null;
  const changed = changingLine
    ? lookupByBinary(storedDr.changedBinary) : undefined;
  emit("complete", storedDr, hexagram, analysis, changed);
}
</script>

<template>
  <div class="coin-toss">
    <div class="coin-lines-area">
      <p v-if="tossCount === 0" class="coin-hint">
        点击下方按钮，每次掷一爻<br>六次成卦，心诚则灵
      </p>

      <div class="coin-lines-list">
        <div
          v-for="(d, i) in details"
          :key="i"
          class="coin-line"
          :class="lineClass(d.value)"
        >
          <span class="line-pos">{{ POS_LABELS[i] }}</span>
          <span class="line-coins">
            <span
              v-for="(c, ci) in d.coins"
              :key="ci"
              class="coin-dot"
              :class="c ? 'heads' : 'tails'"
            >{{ c ? '正' : '反' }}</span>
          </span>
          <span class="line-type">{{ d.type }}</span>
          <div class="line-svg-wrap">
            <svg v-if="d.value === 9 || d.value === 7" viewBox="0 0 72 12" class="line-svg">
              <rect x="6" y="4" width="60" height="4" rx="2" class="svg-yang" />
            </svg>
            <svg v-else viewBox="0 0 72 12" class="line-svg">
              <rect x="6" y="4" width="24" height="4" rx="2" class="svg-yin" />
              <rect x="42" y="4" width="24" height="4" rx="2" class="svg-yin" />
            </svg>
          </div>
        </div>
      </div>

      <p v-if="tossCount > 0 && tossCount < 6" class="coin-progress">
        已掷 {{ tossCount }} / 6 爻
      </p>
    </div>

    <button v-if="tossCount < 6" class="coin-btn" @click="doToss">
      掷第 {{ tossCount + 1 }} 爻
    </button>
    <button v-else class="coin-btn reveal" @click="reveal">
      查看结果
    </button>
  </div>
</template>

<style scoped>
.coin-toss {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.coin-lines-area {
  min-height: 370px;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.coin-hint {
  text-align: center;
  color: oklch(0.52 0.03 40);
  font-size: 15px;
  line-height: 1.8;
  padding: 40px 0;
}

.coin-progress {
  text-align: center;
  font-size: 13px;
  color: oklch(0.52 0.03 40);
  padding: 8px 0 0;
  font-weight: 600;
}

.coin-lines-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 6px;
}

.coin-line {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  background: oklch(0.97 0.002 100);
  animation: line-in 180ms ease both;
  min-height: 52px;
}

.coin-line.line-young-yang { background: oklch(0.97 0.007 20); }
.coin-line.line-old-yang   { background: oklch(0.945 0.025 25); }
.coin-line.line-young-yin  { background: oklch(0.97 0.007 255); }
.coin-line.line-old-yin    { background: oklch(0.945 0.025 260); }

@keyframes line-in {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: none; }
}

.line-pos {
  width: 22px;
  font-size: 13px;
  font-weight: 700;
  color: oklch(0.52 0.03 40);
  text-align: center;
  flex-shrink: 0;
}

.line-coins { display: flex; gap: 4px; flex-shrink: 0; }

.coin-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 13px;
  line-height: 22px;
  text-align: center;
  flex-shrink: 0;
}
.coin-dot.heads { background: #b54433; color: #fff; }
.coin-dot.tails {
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  color: oklch(0.52 0.03 40);
}

.line-type {
  font-size: 12px;
  font-weight: 700;
  color: oklch(0.52 0.03 40);
  flex-shrink: 0;
  width: 30px;
}
.line-old-yang .line-type,
.line-old-yin  .line-type { color: #b54433; }

.line-svg-wrap {
  margin-left: auto;
  width: 72px;
  flex-shrink: 0;
}
.line-svg { display: block; width: 72px; height: 16px; }

.svg-yang { fill: #d4917f; }
.svg-yin  { fill: #8aaccc; }
.line-old-yang .svg-yang { fill: #b54433; }
.line-old-yin  .svg-yin  { fill: #4a8ab5; }

.coin-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.25em;
  cursor: pointer;
  transition: opacity 130ms, transform 100ms;
  background: #b54433;
  color: #fff;
}
.coin-btn:hover  { opacity: 0.85; }
.coin-btn:active { transform: scale(0.97); }
.coin-btn.reveal  { background: #8b3122; }
</style>
