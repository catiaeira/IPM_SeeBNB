<template>
  <div class="checkbox-row" @click="toggle">
    <span class="text">{{ label }}</span>
    <div class="box" :class="{ checked: modelValue }"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  modelValue: Boolean
})

const emit = defineEmits(["update:modelValue"])

function toggle() {
  emit("update:modelValue", !props.modelValue)
}
</script>

<style scoped>
.checkbox-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid white;
  background-color: white;
  transition: background-color 0.2s ease;
  margin-left: 0.5rem;
}

.box.checked {
  background-color: var(--seagreen);
}

.text {
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 550;
  transition: color 0.2s ease;
}
</style>
