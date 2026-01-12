<script setup>
import NavBar from './components/NavBar.vue';
import Bottom from './components/Bottom.vue';
</script>

<template>
  <div id="app">
    <NavBar class="on-top" />
    <router-view class="content" />
    <Bottom />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background) !important;
}

.on-top {
  z-index: 100;
}

.content {
  flex: 1;
  width: 100%;
  margin: 0;
  padding: 0;
}

.empty {
  height: 25px;
}
</style>