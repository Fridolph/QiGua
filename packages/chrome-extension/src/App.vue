<script setup lang="ts">
import { ref } from "vue";
import SideBar from "./components/SideBar.vue";
import MethodChoice from "./components/MethodChoice.vue";
import TimeView from "./components/TimeView.vue";
import CoinToss from "./components/CoinToss.vue";
import NameInput from "./components/NameInput.vue";
import ResultView from "./components/ResultView.vue";
import { lookupByTrigrams, getBodyUseAnalysis, computeChangedHexagram } from "./handbook";
import type { Hexagram, TimeResult, CoinResult, NameResult, BodyUseAnalysis } from "./handbook";

type ActiveView = "choose" | "time" | "coin" | "name" | "result";

const activeView = ref<ActiveView>("choose");
const result = ref<{
  hexagram: Hexagram;
  analysis: BodyUseAnalysis | null;
  changed: Hexagram | undefined;
} | null>(null);

function selectMethod(method: "time" | "coin" | "name") {
  activeView.value = method;
  result.value = null;
}

function onTimeDivine(dr: TimeResult) {
  const hexagram = lookupByTrigrams(dr.upper, dr.lower);
  if (!hexagram) return;
  result.value = {
    hexagram,
    analysis: getBodyUseAnalysis(hexagram, dr.changingLine),
    changed: computeChangedHexagram(hexagram.binary, dr.changingLine),
  };
  activeView.value = "result";
}

function onCoinComplete(
  _dr: CoinResult,
  hexagram: Hexagram,
  analysis: BodyUseAnalysis | null,
  changed: Hexagram | undefined,
) {
  result.value = { hexagram, analysis, changed };
  activeView.value = "result";
}

function onNameComplete(
  _dr: NameResult,
  hexagram: Hexagram,
  analysis: BodyUseAnalysis,
  changed: Hexagram | undefined,
) {
  result.value = { hexagram, analysis, changed };
  activeView.value = "result";
}

function goBack() {
  activeView.value = "choose";
  result.value = null;
}
</script>

<template>
  <div class="app-shell">
    <div class="content">
      <header class="header">
        <div class="brand">
          <span class="logo">每日一卦</span>
          <span class="sub">Good Luck Every Day</span>
        </div>
        <button v-if="activeView !== 'choose'" class="back-btn" @click="goBack">← 返回</button>
      </header>

      <main class="main">
        <MethodChoice v-if="activeView === 'choose'" @select="selectMethod" />
        <TimeView v-else-if="activeView === 'time'" @divine="onTimeDivine" />
        <CoinToss v-else-if="activeView === 'coin'" @complete="onCoinComplete" />
        <NameInput v-else-if="activeView === 'name'" @complete="onNameComplete" />
        <ResultView
          v-if="activeView === 'result' && result"
          :hexagram="result.hexagram"
          :analysis="result.analysis"
          :changed="result.changed"
        />
      </main>
    </div>
    <SideBar />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100%;
  min-height: 500px;
  max-height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid oklch(0.905 0.015 55);
  flex-shrink: 0;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.logo {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: #b54433;
}

.sub {
  font-size: 9px;
  font-weight: 500;
  color: oklch(0.52 0.03 40);
  letter-spacing: 0.04em;
}

.back-btn {
  border: 1px solid oklch(0.905 0.015 55);
  background: oklch(1 0 0);
  border-radius: 6px;
  padding: 3px 10px;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  color: oklch(0.52 0.03 40);
}

.back-btn:hover {
  background: oklch(0.96 0.006 67.78);
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}
</style>
