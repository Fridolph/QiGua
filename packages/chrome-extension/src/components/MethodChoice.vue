<script setup lang="ts">
const emit = defineEmits<{
  select: [method: "time" | "coin" | "name"];
}>();
</script>

<template>
  <div class="method-choice">
    <button class="method-card" @click="emit('select', 'time')">
      <span class="card-icon">⏰</span>
      <span class="card-label">时间起卦</span>
      <span class="card-hint">以当前农历时间立卦</span>
    </button>
    <button class="method-card" @click="emit('select', 'coin')">
      <span class="card-icon">🪙</span>
      <span class="card-label">硬币起卦</span>
      <span class="card-hint">模拟三枚铜钱掷六次</span>
    </button>
    <button class="method-card" @click="emit('select', 'name')">
      <span class="card-icon">✏️</span>
      <span class="card-label">名字起卦</span>
      <span class="card-hint">按简体汉字笔画数立卦</span>
    </button>
  </div>
</template>

<style scoped>
.method-choice {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 6px 0;
}

.method-card {
  flex: 1;
  display: grid;
  grid-template-columns: 48px 1fr;
  grid-template-rows: auto auto;
  gap: 2px 12px;
  align-items: center;
  padding: 18px 16px;
  border: 1px solid oklch(0.905 0.015 55);
  border-radius: 12px;
  background: oklch(1 0 0);
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: border-color 140ms, transform 100ms, box-shadow 140ms;
}

.method-card:hover {
  border-color: #b54433;
  box-shadow: 0 2px 16px rgba(181, 68, 51, 0.1);
}

.method-card:active {
  transform: scale(0.985);
}

.card-icon {
  grid-row: 1 / 3;
  font-size: 26px;
  justify-self: center;
  align-self: center;
}

.card-label {
  font-size: 15px;
  font-weight: 700;
  color: oklch(0.18 0.02 40);
  align-self: end;
}

.card-hint {
  font-size: 11px;
  color: oklch(0.52 0.03 40);
  align-self: start;
}
</style>
