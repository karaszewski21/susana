import { ref, onMounted, onUnmounted } from 'vue';

type MediaDeviceKind = 'audioinput' | 'audiooutput' | 'videoinput';

interface MediaDeviceInfo {
  readonly deviceId: string;
  readonly groupId: string;
  readonly kind: MediaDeviceKind;
  readonly label: string;
  toJSON(): any;
}

export function useCamera() {
  const camera = ref('');
  const cameras = ref<MediaDeviceInfo[]>([]);

  function handler() {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const value = devices.filter((device) => device.kind === 'videoinput');
        cameras.value = value;

        if (cameras.value.length > 0) {
          camera.value = cameras.value[0].deviceId;
        }
      })
      .catch((error) => {
        console.log('errror', error);
      });
  }

  onMounted(() => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', handler);
      handler();
    }
  });

  onUnmounted(() => {
    if (navigator && navigator.mediaDevices) {
      navigator.mediaDevices.removeEventListener('devicechange', handler);
    }
  });

  return {
    camera,
    cameras,
  };
}
