<template>
  <div class="navbar">
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/contact">Contact</NuxtLink>
    <NuxtLink to="/about">About</NuxtLink>
  </div>
</template>
<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: center;

  a {
    padding: 10px;
    text-decoration: none;
  }
}
</style>
