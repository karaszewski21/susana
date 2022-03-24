<template>
  <div class="platform">
    <div class="platform__videoContent">
      <div class="videoContent">
        <video
          id="remote-video"
          class="videoContent__remote"
          autoplay="autoplay"
        ></video>
        <video
          id="local-video"
          class="videoContent__local"
          autoplay="autoplay"
        ></video>
        <label>Enter the number of the room you want to connect</label>
        <input v-model="inputValue" type="text" />
        <button @click="join">CONNECT</button>
      </div>
    </div>
    <div class="platform__rightContent"></div>
    <div class="platform__taskContent"></div>
  </div>
</template>
<script setup lang="ts">
import { io } from 'socket.io-client';
import { computed, onMounted, ref } from 'vue';
import { useCamera } from '../services/cameraService';

let localStream;
let remoteStream;
let isRoomCreator;
let rtcPeerConnection: RTCPeerConnection;
let roomId;

const { camera, cameras } = useCamera();
const socket = io('https://susana-api.herokuapp.com/');
const inputValue = ref('');

const mediaConstraints = {
  audio: true,
  video: { width: 1280, height: 720 },
};
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com',
    },
  ],
};

const camerasLabels = computed(() =>
  cameras.value.map((camera) => camera.label || camera.deviceId),
);

// navigator.mediaDevices
//   .getUserMedia({ video: true })
//   .then((stream) => {
//     const video1 = document.getElementById('local-video');
//     const video2 = document.getElementById('remote-video');
//     video1.srcObject = stream;
//     video2.srcObject = stream;
//     // video.play();
//   })
//   .catch((error) => {
//     console.log('errror', error);
//   });

const join = () => {
  if (inputValue.value === '') {
    alert('Please type a room ID');
  } else {
    roomId = inputValue.value;
    socket.emit('join', inputValue.value);
  }
};

// // SOCKET EVENT CALLBACKS =====================================================
socket.on('room_created', async () => {
  console.log('Socket event callback: room_created');

  await setLocalStream(mediaConstraints);
  isRoomCreator = true;
});

socket.on('room_joined', async () => {
  console.log('Socket event callback: room_joined');

  console.log(mediaConstraints, roomId);
  await setLocalStream(mediaConstraints);

  socket.emit('start_call', roomId);
});

socket.on('full_room', () => {
  console.log('Socket event callback: full_room');

  alert('The room is full, please try another one');
});

const setLocalStream = async (mediaConstraints) => {
  let stream;
  try {
    stream = await window.navigator.mediaDevices.getUserMedia(mediaConstraints);
  } catch (error) {
    console.error('Could not get user media', error);
  }

  const video1 = document.getElementById('local-video');
  localStream = stream;
  video1.srcObject = stream;
};

// // SOCKET EVENT CALLBACKS =====================================================
socket.on('start_call', async () => {
  console.log('Socket event callback: start_call');

  try {
    if (isRoomCreator) {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.ontrack = setRemoteStream;
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      await createOffer(rtcPeerConnection);
    }
  } catch (error) {
    console.error(error);
  }
});

socket.on('webrtc_offer', async (event) => {
  console.log('Socket event callback: webrtc_offer');

  try {
    if (!isRoomCreator) {
      rtcPeerConnection = new RTCPeerConnection(iceServers);
      addLocalTracks(rtcPeerConnection);
      rtcPeerConnection.ontrack = setRemoteStream;
      rtcPeerConnection.onicecandidate = sendIceCandidate;
      await rtcPeerConnection.setRemoteDescription(
        new RTCSessionDescription(event),
      );
      await createAnswer(rtcPeerConnection);
    }
  } catch (error) {
    console.error(error);
  }
});

socket.on('webrtc_answer', async (event) => {
  console.log('Socket event callback: webrtc_answer');

  await rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(event),
  );
});

socket.on('webrtc_ice_candidate', async (event) => {
  console.log('Socket event callback: webrtc_ice_candidate');

  if (rtcPeerConnection) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate,
    });

    console.log('---> rtc', rtcPeerConnection);
    console.log('---> candidate', candidate);
    await rtcPeerConnection.addIceCandidate(candidate);
  }
});

const addLocalTracks = (rtcPeerConnection) => {
  localStream.getTracks().forEach((track) => {
    console.log('---> track', track);

    if (rtcPeerConnection) {
      rtcPeerConnection.addTrack(track, localStream);
    }
  });
};

const createOffer = async (rtcPeerConnection) => {
  let sessionDescription;
  try {
    sessionDescription = await rtcPeerConnection.createOffer();
    rtcPeerConnection.setLocalDescription(sessionDescription);
  } catch (error) {
    console.error(error);
  }

  socket.emit('webrtc_offer', {
    type: 'webrtc_offer',
    sdp: sessionDescription,
    roomId,
  });
};

const createAnswer = async (rtcPeerConnection) => {
  let sessionDescription;
  try {
    sessionDescription = await rtcPeerConnection.createAnswer();
    rtcPeerConnection.setLocalDescription(sessionDescription);
  } catch (error) {
    console.error(error);
  }

  socket.emit('webrtc_answer', {
    type: 'webrtc_answer',
    sdp: sessionDescription,
    roomId,
  });
};

const setRemoteStream = (event) => {
  const video2 = document.getElementById('remote-video');
  video2.srcObject = event.streams[0];
  remoteStream = event.stream;
};

const sendIceCandidate = (event) => {
  if (event.candidate) {
    console.log('----> ', event);
    socket.emit('webrtc_ice_candidate', {
      roomId,
      label: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    });
  }
};
</script>
<style scoped lang="scss">
.platform {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: auto;
  grid-template-areas:
    'videoContent videoContent rightContent'
    'videoContent videoContent rightContent'
    'taskContent  taskContent taskContent';

  &__videoContent {
    display: flex;
    justify-content: center;
    grid-area: videoContent;
  }

  &__rightContent {
    grid-area: rightContent;
    background-color: brown;
    width: 300px;
    height: 100%;
  }

  &__taskContent {
    grid-area: taskContent;
    background-color: chartreuse;
    width: 100%;
    height: 300px;
  }
}

.videoContent {
  width: 800px;
  height: 800px;
  background-color: aqua;
  position: relative;

  &__remote {
    width: 800px;
    height: 800px;
    top: 0;
    left: 0;
    object-fit: cover;
    background-color: antiquewhite;
  }

  &__local {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 0;
    right: 0;
    object-fit: cover;
    background-color: blue;
  }
}

.centered {
  transform: translate(-50%, -50%);
}
</style>
