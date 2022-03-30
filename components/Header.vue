<template>
  <div class="header">
    <div class="header__logo">
      <span class="material-icons-outlined"> face </span>
      logo
    </div>
    <span class="material-icons-outlined"> settings </span>
    <span class="material-icons-outlined"> account_circle </span>
  </div>
</template>
<style scoped lang="scss">
.header {
  height: 50px;
  width: 100%;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;

  &__logo {
    position: absolute;
    left: 0;
  }
}
</style>
