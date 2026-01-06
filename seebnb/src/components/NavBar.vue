<template>
  <nav id="navbar">
    <!-- Left: -->
    <div class="left-side">
      <router-link to="/home" class="home-link">SeeBNB</router-link>
      <img :src="ImageDict.logo" width="50px"/>
    </div>
    
    <!-- Right: -->
    <div class="right-side">
      <Export ></Export>
      <ThemeToggle></ThemeToggle>
    </div>
  </nav>
</template>

<script setup>
import ImageDict from '@/assets/ImageDict'
import ThemeToggle from './ThemeToggle.vue'
import Export from './Export.vue'
</script>

<style scoped>
#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 1%;
  left: 1%;
  width: 98%;
  height: 50px;
  text-align: center;
  padding: 1%;
  border-radius: 0px 45px;
  background-color: var(--seagreen);
  font-size: 1rem;
  z-index: 500;
}

.home-link {
  text-decoration: none;
  padding: 0;
  margin: 0;
  color: var(--text);
  background: transparent;
}

.home-link:hover {
  background: transparent;
  text-decoration: none;
}

.left-side{
  display: flex;
  align-items: center;
}

.right-side{
  display: flex;
  align-items: center;
  height: 20px;
  gap: 0.5rem;
}
</style>