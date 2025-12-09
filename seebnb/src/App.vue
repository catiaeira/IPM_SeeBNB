<script setup>
import NavBar from './components/NavBar.vue';
import Bottom from './components/Bottom.vue';
</script>

<template id="app">
  <NavBar />
  <router-view />
  <Bottom />
</template>

<style scoped>
#app{
  display: flex;
  flex-direction: column;
  background-color: var(--background) !important;
}
</style>