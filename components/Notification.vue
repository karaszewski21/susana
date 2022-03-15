<template>
  <div class="notification is-danger">
    {{ props.message }}
  </div>
</template>
<script setup>
const props = defineProps({
  message: { type: String },
});
</script>
