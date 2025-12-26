<template>
  <div class="slider" ref="slider">
    <div class="track"></div>
    <div class="range" :style="{ left: leftPercent + '%', width: rightPercent - leftPercent + '%' }"></div>

    <!-- Left Thumb -->
    <div
      class="thumb"
      :style="{ left: leftPercent + '%' }"
      @mousedown="startDrag('left')"
      @touchstart.prevent="startDrag('left')"
      @mouseenter="hovered = 'left'"
      @mouseleave="hovered = null"
    >
      <span class="label" v-if="activeThumb === 'left' || hovered === 'left'">{{ left }}</span>
    </div>

    <!-- Right Thumb -->
    <div
      class="thumb"
      :style="{ left: rightPercent + '%' }"
      @mousedown="startDrag('right')"
      @touchstart.prevent="startDrag('right')"
      @mouseenter="hovered = 'right'"
      @mouseleave="hovered = null"
    >
      <span class="label" v-if="activeThumb === 'right' || hovered === 'right'">{{ right }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";

const emit = defineEmits(["update:modelValue", "change"]);
const slider = ref(null);
const activeThumb = ref(null);
const hovered = ref(null);

const min = 1;
const max = 5;
const step = 1;
const minGap = 1;

const left = ref(min);
const right = ref(max);

const leftPercent = computed(() => ((left.value - min) / (max - min)) * 100);
const rightPercent = computed(() => ((right.value - min) / (max - min)) * 100);

function startDrag(which) {
  activeThumb.value = which;

  const move = e => drag(e);
  const up = () => stopDrag(move, up);

  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move);
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
}

function drag(e) {
  const rect = slider.value.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  let raw = min + percent * (max - min);
  raw = Math.round(raw / step) * step;

  if (activeThumb.value === "left") left.value = Math.min(Math.max(min, raw), right.value - minGap);
  if (activeThumb.value === "right") right.value = Math.max(Math.min(max, raw), left.value + minGap);

  emit("update:modelValue", [left.value, right.value]);
}

function stopDrag(move, up) {
  emit("change", [left.value, right.value]);
  activeThumb.value = null;
  window.removeEventListener("mousemove", move);
  window.removeEventListener("touchmove", move);
  window.removeEventListener("mouseup", up);
  window.removeEventListener("touchend", up);
}

onBeforeUnmount(() => stopDrag(() => {}, () => {}));
</script>

<style scoped>
.slider { 
  position: relative;
  height: 10px;
  width: 12rem;
  border-radius: 5px;
  margin: 1rem;
}

.track {
  position: absolute;
  inset: 0;
  border-radius: 5px;
  background: var(--accent);
}

.range {
  position: absolute;
  height: 100%;
  border-radius: 5px;
  border: 2px solid white;
  background: var(--accent);
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  background: var(--accent);
}

.label { 
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--text);
  padding: 4px 9px;
  font-size: 13px;
  border: 1px solid white;
  border-radius: 6px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
