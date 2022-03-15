<template>
  <h1>Create new</h1>
  <form action="/register" method="POST">
    <div>
      <label for="username">Login</label>
      <input name="username" id="username" :value="register.username" />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        :value="register.password"
      />
    </div>
    <div>
      <button>Send my greetings</button>
    </div>
  </form>
</template>
<script setup>
const register = () =>
  useState({
    username: '',
    password: '',
  });
</script>
