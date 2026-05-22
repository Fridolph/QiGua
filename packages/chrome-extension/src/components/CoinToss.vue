<script setup lang="ts">
import { ref, reactive } from "vue";
import { divineByCoin, lookupByBinary, getBodyUseAnalysis } from "../handbook";
import type { CoinResult, CoinTossDetail, Hexagram, BodyUseAnalysis } from "../handbook";

const emit = defineEmits<{
  complete: [dr: CoinResult, hexagram: Hexagram, analysis: BodyUseAnalysis | null, changed: Hexagram | undefined];
}>();

const phase = ref<"idle" | "tossing" | "done">("idle");
const lines = reactive<{ pos: number; detail: CoinTossDetail }[]>([]);
let storedDr: CoinResult | null = null;

const POS_LABELS = ["初", "二", "三", "四", "五", "上"];

async function startToss() {
  if (phase.value === "tossing") return;
  phase.value = "tossing";
  lines.length = 0;

  const dr = divineByCoin();

  for (let i = 0; i < dr.tossDetails.length; i++) {
    await delay(180);
    lines.push({ pos: i + 1, detail: dr.tossDetails[i] });
  }

  await delay(400);
  storedDr = dr;
  phase.value = "done";
}

function reveal() {
  const dr = storedDr;
  if (!dr) return;

  const hexagram = lookupByBinary(dr.binary);
  if (!hexagram) return;

  const changingLine = dr.changingPositions.length > 0 ? dr.changingPositions[0] : null;
  const analysis = changingLine ? getBodyUseAnalysis(hexagram, changingLine) : null;
  const changed = changingLine ? lookupByBinary(dr.changedBinary) : undefined;

  emit("complete", dr, hexagram, analysis, changed);
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isChanging(v: number) { return v === 6 || v === 9; }
function isYang(v: number) { return v === 9 || v === 7; }
</script>

<template>
  <div class="coin-toss">
    <div class="coin-lines-area">
      <p v-if="phase === 'idle'" class="coin-hint">三枚铜钱，掷六次成卦<br>心诚则灵</p>
      <p v-if="phase === 'tossing' && lines.length < 6" class="coin-hint tossing">摇卦中，请勿操作…</p>

      <TransitionGroup name="line" tag="div" class="coin-lines-list">
        <div
          v-for="line in lines"
          :key="line.pos"
          class="coin-line"
          :class="{ changing: isChanging(line.detail.value) }"
        >
          <span class="line-pos">{{ POS_LABELS[line.pos - 1] }}</span>
          <span class="line-coins">
            <span
              v-for="(c, ci) in line.detail.coins"
              :key="ci"
              class="coin-dot"
              :class="c ? 'heads' : 'tails'"
            >{{ c ? '正' : '反' }}</span>
          </span>
          <span class="line-type">{{ line.detail.type }}</span>
          <span class="line-bar">
            {{ isYang(line.detail.value) ? '━━━' : '━ ━' }}
          </span>
        </div>
      </TransitionGroup>
    </div>

    <button
      v-if="phase !== 'done'"
      class="coin-btn"
      :disabled="phase === 'tossing'"
      @click="startToss"
    >
      {{ phase === 'tossing' ? '掷硬币中…' : '掷硬币起卦' }}
    </button>

    <button
      v-else
      class="coin-btn reveal"
      @click="reveal"
    >
      解 卦
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
  min-height: 320px;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.coin-hint {
  text-align: center;
  color: oklch(0.52 0.03 40);
  font-size: 13px;
  line-height: 1.8;
  padding: 40px 0;
}

.coin-hint.tossing {
  color: #b54433;
  font-weight: 600;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.coin-lines-list {
  display: flex;
  flex-direction: column-reverse;
  gap: 4px;
}

.coin-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  background: oklch(0.96 0.006 67.78);
}

.coin-line.changing {
  background: oklch(0.95 0.02 25);
}

.line-pos {
  width: 20px;
  font-size: 11px;
  font-weight: 600;
  color: oklch(0.52 0.03 40);
  text-align: center;
}

.line-coins {
  display: flex;
  gap: 4px;
}

.coin-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  flex-shrink: 0;
}

.coin-dot.heads {
  background: #b54433;
  color: #fff;
}

.coin-dot.tails {
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  color: oklch(0.52 0.03 40);
}

.line-type {
  font-size: 10px;
  font-weight: 600;
  color: oklch(0.52 0.03 40);
}

.coin-line.changing .line-type {
  color: #b54433;
}

.line-bar {
  margin-left: auto;
  font-size: 18px;
  color: oklch(0.18 0.02 40);
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  letter-spacing: 2px;
}

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

.coin-btn:hover { opacity: 0.85; }
.coin-btn:active { transform: scale(0.97); }
.coin-btn:disabled {
  opacity: 0.45;
  cursor: wait;
  letter-spacing: 0.15em;
}

.coin-btn.reveal {
  background: #8b3122;
}

.line-enter-active {
  animation: line-in 200ms ease both;
}

@keyframes line-in {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: none; }
}
</style>
