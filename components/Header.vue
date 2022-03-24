<template>
  <div class="header">
    <div class="header__logo">Logo</div>
    <div>Menu</div>
    <div>Login icon</div>
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
