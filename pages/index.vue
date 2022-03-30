<template>
  <div class="platform">
    <div class="platform__videoContent">
      <div class="videoContent">
        <WebrtcVideo :videoId="'remote-video'" class="videoContent__remote" />
        <WebrtcVideo :videoId="'local-video'" class="videoContent__local" />
        <button class="videoContent__buttonConnect" @click="connect">
          CONNECT
        </button>
      </div>
    </div>
    <div class="platform__rightContent"></div>
    <div class="platform__taskContent">tasks task</div>
  </div>
</template>
<script setup lang="ts">
const connect = () => {
  joinToRoom();
};
</script>
<style scoped lang="scss">
.platform {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto;
  grid-template-areas:
    'videoContent videoContent rightContent'
    'videoContent videoContent rightContent'
    'taskContent  taskContent taskContent';

  @media (max-width: 500px) {
    grid-template-columns: auto;
    grid-template-rows: auto;
    grid-template-areas:
      'videoContent'
      'taskContent';
  }

  &__videoContent {
    display: flex;
    justify-content: center;
    grid-area: videoContent;
  }

  &__rightContent {
    grid-area: rightContent;
    background-color: brown;
    width: 300px;
    min-height: 600px;

    @media (max-width: 500px) {
      position: absolute;
      display: none;
      transform: translateX(300px);
      width: 300px;
      min-height: 600px;
    }
  }

  &__taskContent {
    grid-area: taskContent;
    background-color: chartreuse;
    width: 100%;
    height: 100%;
  }
}

.videoContent {
  width: 800px;
  height: 600px;
  background-color: aqua;
  position: relative;

  @media (max-width: 500px) {
    width: 360px;
    height: 300px;
  }

  &__remote {
    width: 800px;
    height: 600px;

    @media (max-width: 500px) {
      width: 360px;
      height: 300px;
    }

    top: 0;
    left: 0;
    object-fit: cover;
  }

  &__local {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 0;
    right: 0;
    object-fit: cover;
    @media (max-width: 500px) {
      width: 100px;
      height: 100px;
    }
  }

  &__buttonConnect {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.centered {
  transform: translate(-50%, -50%);
}
</style>
