import { io } from 'socket.io-client';
import { iceServers } from '~~/config';

const socket = io('https://susana-api.herokuapp.com/');

let localStream: MediaStream;
let remoteStream: MediaStream;
let isRoomCreator: boolean = false;
let rtcPeerConnection: RTCPeerConnection;
let roomId: string;

//========================= SOCKET EVENT CALLBACKS ============================

socket.on('room_created', async () => {
  await setLocalStream();
  isRoomCreator = true;
});

socket.on('room_joined', async () => {
  await setLocalStream();
  socket.emit('start_call', roomId);
});

socket.on('full_room', () => {
  window.alert('The room is full, please try another one');
});

socket.on('start_call', async () => {
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
  await rtcPeerConnection.setRemoteDescription(
    new RTCSessionDescription(event),
  );
});

socket.on('webrtc_ice_candidate', async (event) => {
  if (rtcPeerConnection) {
    var candidate = new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate,
    });
    await rtcPeerConnection.addIceCandidate(candidate);
  }
});

//========================= SOCKET EMIT EVENT  ============================

const sendIceCandidate = (event: RTCPeerConnectionIceEvent) => {
  if (event.candidate) {
    socket.emit('webrtc_ice_candidate', {
      roomId,
      label: event.candidate.sdpMLineIndex,
      candidate: event.candidate.candidate,
    });
  }
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

const addLocalTracks = (rtcPeerConnection: RTCPeerConnection) => {
  localStream.getTracks().forEach((track: MediaStreamTrack) => {
    if (rtcPeerConnection) {
      rtcPeerConnection.addTrack(track, localStream);
    }
  });
};

const setLocalStream = async () => {
  let stream: MediaStream;
  try {
    stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 800, height: 600 },
    });
  } catch (error) {
    console.error('Could not get user media', error);
  }

  const video = document.getElementById('local-video') as HTMLMediaElement;
  localStream = stream;
  video.srcObject = stream;
};

const setRemoteStream = (event: RTCTrackEvent) => {
  const video = document.getElementById('remote-video') as HTMLMediaElement;
  video.srcObject = event.streams[0];
  remoteStream = event.streams[0];
};

export const joinToRoom = (id: string) => {
  roomId = '21';
  socket.emit('join', roomId);
};
