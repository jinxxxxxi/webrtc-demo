<template>
  <div class="video-container">
    <button @click="handleClickRecord">开始录制</button>
    <video ref="video" autoplay></video>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class MediaRecord extends Vue {
  async getDisplayMedia() {
    const constraints = {
      video: {
        width: 500,
        height: 400,
        frameRate: 13,
      },
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
      },
    };
    let captureStream = null;
    // 获取桌面共享流
    try {
      // @ts-ignore
      captureStream = await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch (err) {
      console.error("Error: " + err);
    }

    // 获取音频轨
    let audioStream = null;
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
    } catch (err) {
      console.error("Error: " + err);
    }
    captureStream.addTrack(audioStream?.getAudioTracks()[0]);

    console.log(captureStream.getTracks());

    // 将录制的视频进行播放
    const $el: any = this.$refs.video;
    $el.srcObject = captureStream;
  }
  handleClickRecord() {
    this.getDisplayMedia();
  }
}
</script>

<style></style>
