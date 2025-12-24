<template>
  <nav id="navbar">
    <!-- Left: -->
    <div class="left-side">
      <router-link to="/home" class="home-link">SeeBNB</router-link>
      <img :src="logo" width="50px"/>
    </div>
    

    <!-- Right: -->
    <div class="right-side">
      <ThemeToggle></ThemeToggle>
    </div>
  </nav>
</template>

<script setup>
  import logo from '@/assets/seebnblogo.svg'
  import ThemeToggle from './ThemeToggle.vue';
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
  background-color: var(--accent);
  font-size: 1rem;
  z-index: 500;
}

.home-link {
  text-decoration: none;
  padding: 0;
  margin: 0;
  font-weight: 600;
  color: var(--text);
  background: transparent;
}

.home-link:hover {
  background: transparent;
  text-decoration: none;
}

/* Left side container */
.left-side{
  display: flex;
  align-items: center;
}

/* Right side container */
.right-side{
  display: flex;
  align-items: center;
  height: 20px;
}
</style>
