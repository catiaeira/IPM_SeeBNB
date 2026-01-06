<script setup>
import ImageDict from '@/assets/ImageDict'
import { ref, onMounted } from 'vue'

const theme = ref('light')

const setTheme = (value) => {
  theme.value = value
  document.documentElement.setAttribute('theme', value)
}

const toggleTheme = () => {
  setTheme(theme.value === 'light' ? 'dark' : 'light')
}

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setTheme(prefersDark ? 'dark' : 'light')

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setTheme(e.matches ? 'dark' : 'light')
  })
})
</script>

<template>
  <button @click="toggleTheme">
    <span v-if="theme === 'light'"><img :src="ImageDict.sun" width="30px"/></span>
    <span v-else><img :src="ImageDict.moon" width="20px"/></span>
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text);
}
</style>
