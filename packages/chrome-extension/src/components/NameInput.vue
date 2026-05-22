<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { divineByName, lookupByTrigrams, getBodyUseAnalysis, computeChangedHexagram } from "../handbook";
import type { NameResult, Hexagram, BodyUseAnalysis } from "../handbook";

const emit = defineEmits<{
  complete: [dr: NameResult, hexagram: Hexagram, analysis: BodyUseAnalysis, changed: Hexagram | undefined];
}>();

const input = ref("");

const chars = computed(() => [...input.value].slice(0, 4));

const strokeMap = computed(() => {
  return chars.value.map(ch => {
    const dr = divineByName(ch);
    return dr ? dr.strokes[0] : 0;
  });
});

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  const filtered = [...val].filter(ch => {
    const code = ch.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF) || code > 127;
  }).join("");
  input.value = filtered.slice(0, 4);
}

function submit() {
  const text = input.value;
  if (!text.trim() || chars.value.length === 0) return;

  const dr = divineByName(text);
  if (!dr) return;

  const hexagram = lookupByTrigrams(dr.upper, dr.lower);
  if (!hexagram) return;

  const analysis = getBodyUseAnalysis(hexagram, dr.changingLine);
  const changed = computeChangedHexagram(hexagram.binary, dr.changingLine);

  emit("complete", dr, hexagram, analysis, changed);
}

function canSubmit() {
  return input.value.trim().length > 0;
}
</script>

<template>
  <div class="name-input">
    <input
      :value="input"
      type="text"
      class="text-input"
      placeholder="输入姓名（最多 4 字）"
      autocomplete="off"
      @input="onInput"
      @keydown.enter="canSubmit() && submit()"
    />

    <div v-if="chars.length > 0" class="mizige-area">
      <div v-for="(ch, i) in chars" :key="i" class="mizige-cell">
        <div class="mizige-char">{{ ch }}</div>
        <div class="mizige-stroke">{{ strokeMap[i] }}画</div>
      </div>
    </div>

    <button
      class="submit-btn"
      :disabled="!canSubmit()"
      @click="submit"
    >
      起 卦
    </button>
  </div>
</template>

<style scoped>
.name-input {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0;
}

.text-input {
  width: 100%;
  height: 48px;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 10px;
  color: oklch(0.18 0.02 40);
  padding: 0 14px;
  font: inherit;
  font-size: 16px;
  text-align: center;
  letter-spacing: 0.3em;
  outline: none;
  transition: border-color 140ms;
}

.text-input::placeholder {
  color: oklch(0.52 0.03 40);
  letter-spacing: 0.05em;
  font-size: 14px;
}

.text-input:focus {
  border-color: #b54433;
}

.mizige-area {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.mizige-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.mizige-char {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  background: oklch(1 0 0);
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 8px;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", "KaiTi SC", serif;
  font-size: 30px;
  font-weight: 700;
  color: oklch(0.18 0.02 40);
  position: relative;
}

.mizige-char::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, transparent calc(50% - 0.5px), oklch(0.905 0.015 55 / 0.3) calc(50% - 0.5px), oklch(0.905 0.015 55 / 0.3) calc(50% + 0.5px), transparent calc(50% + 0.5px)),
    linear-gradient(to bottom, transparent calc(50% - 0.5px), oklch(0.905 0.015 55 / 0.3) calc(50% - 0.5px), oklch(0.905 0.015 55 / 0.3) calc(50% + 0.5px), transparent calc(50% + 0.5px));
  border-radius: inherit;
  pointer-events: none;
}

.mizige-stroke {
  font-size: 11px;
  font-weight: 600;
  color: #b54433;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
}

.submit-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 12px;
  font-family: "Songti SC", "STSongti", "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3em;
  cursor: pointer;
  transition: opacity 130ms, transform 100ms;
  background: #b54433;
  color: #fff;
}

.submit-btn:hover { opacity: 0.85; }
.submit-btn:active { transform: scale(0.97); }
.submit-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
