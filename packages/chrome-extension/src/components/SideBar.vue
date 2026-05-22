<script setup lang="ts">
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <div class="sidebar-logo">Q</div>
    </div>
    <div class="sidebar-nav">
      <button class="nav-item active" title="起卦">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 60px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #b54433;
  padding-top: 12px;
  gap: 20px;
}

.sidebar-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,0.18);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 16px;
  font-weight: 800;
}

.nav-item {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 130ms, color 130ms;
}

.nav-item svg {
  width: 18px;
  height: 18px;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
</style>
