<script setup lang="ts">
import { computed } from "vue";
import { getTrigrams } from "../handbook";
import type { Hexagram, BodyUseAnalysis } from "../handbook";

const props = defineProps<{
  hexagram: Hexagram;
  analysis: BodyUseAnalysis | null;
  changed: Hexagram | undefined;
}>();

const trigramsData = getTrigrams();

const upperTri = computed(() => trigramsData[props.hexagram.upper]);
const lowerTri = computed(() => trigramsData[props.hexagram.lower]);
const showChanged = computed(() => props.changed && props.changed.index !== props.hexagram.index);
</script>

<template>
  <div class="result-view">
    <div class="hex-symbol">{{ hexagram.symbol }}</div>
    <div class="hex-name">{{ hexagram.name }}</div>

    <div class="trigram-row">
      <div class="tri-card">
        <span class="tri-label">上卦</span>
        <span class="tri-sym">{{ upperTri.symbol }}</span>
        <span class="tri-name">{{ upperTri.name }} ({{ upperTri.nature }} · {{ upperTri.element }})</span>
      </div>
      <div class="tri-card">
        <span class="tri-label">下卦</span>
        <span class="tri-sym">{{ lowerTri.symbol }}</span>
        <span class="tri-name">{{ lowerTri.name }} ({{ lowerTri.nature }} · {{ lowerTri.element }})</span>
      </div>
    </div>

    <div v-if="analysis" class="body-use">
      <div class="bu-cell">
        <div class="bu-label">体卦</div>
        <div class="bu-value">{{ analysis.body.name }} {{ analysis.body.symbol }} ({{ analysis.body.element }})</div>
      </div>
      <div class="bu-cell">
        <div class="bu-label">用卦</div>
        <div class="bu-value">{{ analysis.use.name }} {{ analysis.use.symbol }} ({{ analysis.use.element }})</div>
      </div>
      <div class="bu-verdict">
        {{ analysis.level }} {{ analysis.relation }} · {{ analysis.judgment }}  |  {{ analysis.description }}
      </div>
    </div>
    <div v-else class="body-use">
      <div class="bu-verdict" style="grid-column: 1 / -1">静卦 · 无动爻</div>
    </div>

    <div v-if="changed && showChanged" class="changed-hex">
      <div class="changed-label">动爻变 → 变卦</div>
      <div class="changed-symbol">{{ changed.symbol }}</div>
      <div class="changed-name">{{ changed.name }}</div>
      <div class="changed-detail">
        上{{ trigramsData[changed.upper].symbol }}{{ trigramsData[changed.upper].name }}
        · 下{{ trigramsData[changed.lower].symbol }}{{ trigramsData[changed.lower].name }}
      </div>
    </div>

    <div class="semantic">
      <span class="sem-tag">{{ hexagram.semantic }} · {{ hexagram.semantic_en }}</span>
      <p class="sem-desc">{{ hexagram.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.result-view { text-align: center; display: grid; gap: 12px; }

.hex-symbol { font-size: 56px; line-height: 1; color: #b54433; }
.hex-name  { font-size: 24px; font-weight: 800; letter-spacing: 0.06em; color: oklch(0.18 0.02 40); }

.trigram-row { display: flex; justify-content: center; gap: 28px; }
.tri-card    { display: grid; justify-items: center; gap: 3px; }
.tri-label   { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: oklch(0.52 0.03 40); }
.tri-sym     { font-size: 28px; color: #b54433; }
.tri-name    { font-size: 15px; font-weight: 700; color: oklch(0.18 0.02 40); }

.body-use     { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.bu-cell      { background: oklch(0.96 0.006 67.78); border-radius: 8px; padding: 10px 10px; text-align: center; }
.bu-label     { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: oklch(0.52 0.03 40); margin-bottom: 4px; }
.bu-value     { font-size: 15px; font-weight: 700; }
.bu-verdict   { grid-column: 1 / -1; text-align: center; padding: 8px; border-radius: 8px; background: oklch(1 0 0); border: 1px solid oklch(0.905 0.015 55); font-size: 15px; font-weight: 600; }

.changed-hex    { padding: 12px; border-radius: 10px; background: oklch(1 0 0); border: 1px dashed oklch(0.905 0.015 55); }
.changed-label  { font-size: 15px; color: oklch(0.52 0.03 40); margin-bottom: 6px; }
.changed-symbol { font-size: 40px; color: oklch(0.35 0.08 20); }
.changed-name   { font-size: 16px; font-weight: 700; }
.changed-detail { font-size: 15px; color: oklch(0.52 0.03 40); margin-top: 4px; }

.semantic { margin-top: 4px; }
.sem-tag  { display: inline-block; padding: 4px 10px; border-radius: 5px; background: #b54433; color: #fff; font-size: 15px; font-weight: 700; margin-bottom: 6px; }
.sem-desc { font-size: 15px; color: oklch(0.52 0.03 40); line-height: 1.6; }
</style>
