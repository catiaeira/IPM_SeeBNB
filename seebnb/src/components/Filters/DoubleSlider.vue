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
import { ref, computed, watch, onBeforeUnmount } from "vue"

const slider = ref(null)
const hovered = ref(null)
const activeThumb = ref(null)

const min = 1
const max = 5
const step = 1
const minGap = 1

const props = defineProps({
  leftValue: { type: Number, default: min },
  rightValue: { type: Number, default: max }
})

const emit = defineEmits([
  "update:leftValue",
  "update:rightValue",
  "change"
])

const left = ref(props.leftValue)
const right = ref(props.rightValue)

watch(() => props.leftValue, val => left.value = val)
watch(() => props.rightValue, val => right.value = val)

const leftPercent = computed(() => ((left.value - min) / (max - min)) * 100)
const rightPercent = computed(() => ((right.value - min) / (max - min)) * 100)

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
}

function stopDrag(move, up) {
  emit("update:leftValue", left.value)
  emit("update:rightValue", right.value)
  emit("change", { left: left.value, right: right.value })

  activeThumb.value = null
  window.removeEventListener("mousemove", move)
  window.removeEventListener("touchmove", move)
  window.removeEventListener("mouseup", up)
  window.removeEventListener("touchend", up)
}

onBeforeUnmount(() => stopDrag(() => {}, () => {}));
</script>

<style scoped>
.slider {
  position: relative;
  width: 12rem;
  height: 10px;
  margin: 1rem;
  border-radius: 5px;
}

.track,
.range {
  position: absolute;
  inset: 0;
  border-radius: 5px;
}

.track {
  background: white;
}

.range {
  background: var(--seagreen);
  border: 2px solid white;
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--seagreen);
  border: 2px solid white;
  cursor: pointer;
}

.label {
  position: absolute;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 9px;
  font-size: 13px;
  font-weight: 600;
  background: var(--seagreen);
  border: 1px solid white;
  border-radius: 6px;
  color: var(--text);
  white-space: nowrap;
}
</style>
