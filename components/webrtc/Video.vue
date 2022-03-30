<template>
  <video :id="videoId" autoplay="autoplay"></video>
</template>
<script>
export default {
  props: {
    videoId: String,
  },
};
</script>
