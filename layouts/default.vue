<template>
  <Header />
  <div class="container">
    <div>left</div>
    <div>
      <Navbar />
      <slot />
    </div>

    <div>right</div>
  </div>
</template>
<script setup>
import Navbar from '../components/Navbar.vue';
</script>
<style scoped>
* {
  margin: 0;
}
.container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1300px 1fr;
  grid-template-rows: 50px 1fr;
}
</style>
