<template>
  <Header />
  <Navbar />
  <slot />
</template>
<script setup>
import Navbar from '../components/Navbar.vue';
</script>
<style scoped lang="scss">
@import url('https://meyerweb.com/eric/tools/css/reset/reset.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Outlined');
</style>
