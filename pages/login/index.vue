<template>
  <h1>Login</h1>
  <form action="/login" method="POST">
    <div>
      <label for="username">login</label>
      <input name="username" id="username" :value="auth.username" />
    </div>
    <div>
      <label for="password">Possword</label>
      <input
        type="password"
        name="password"
        id="password"
        :value="auth.password"
      />
    </div>
    <div>
      <button>login</button>
    </div>
  </form>

  <NuxtLink to="/register">register</NuxtLink>
</template>
<script setup>
const auth = () =>
  useState({
    username: '',
    password: '',
  });
const register = () => {
  return navigateTo('/register');
};
</script>
