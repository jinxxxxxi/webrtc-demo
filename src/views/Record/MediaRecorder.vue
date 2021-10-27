<template>
  <div class="video-container">
    <video ref="recordVideo" playsinline autoplay />

    <div>
      <button @click="handleClickRecord">
        {{ startRecord ? "暂停录制" : "开始录制" }}
      </button>
    </div>
    <div>
      <button :disabled="isDisabled" @click="handleClickPlay">播放</button>
    </div>
    <div><button :disabled="isDisabled" @click="handleClickDownload">下载</button></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";


@Options({})
export default class MediaRecord extends Vue {
  startRecord = false;
  isDisabled = true;
  stream = {};
  buffer: any = [];
  mediaRecorder: any = {};

  created() {
    this.getUserMedia();
  }
  getUserMedia() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("navigator.mediaDevices.getUserMedia is not supported");
      return;
    }

    const constrants = {
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

    navigator.mediaDevices
      .getUserMedia(constrants)
      .then(this.handleMediaStream)
      .catch(this.handleError);
  }
  handleMediaStream(stream: any) {
    // const $el: any = this.$refs.recordVideo;
    // $el.srcObject = stream;
    this.stream = stream;
  }

  handleError(err: any) {
    console.log("err", err);
  }
  handleClickRecord() {
    this.isDisabled = false;
    this.startRecord = !this.startRecord;
    if (this.startRecord) {
      this.start();
    } else {
      this.end();
    }
  }
  start() {
    const options = {
      mimeType: "video/webm;codecs=vp8",
    };
    // MediaRecorder.isTypeSupported();
    // @ts-ignore
    // TODO: 
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(options.mimeType + "is not supported");
      return;
    }

    try {
      // @ts-ignore
      this.mediaRecorder = new window.MediaRecorder(this.stream, options);
      this.buffer = [];
    } catch (err) {
      console.log("Failed to create MediaRecorder", err);
    }
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start(10);
  }
  end() {
    this.mediaRecorder.stop();
  }
  handleDataAvailable(e: any) {
    console.log(e.data);
    
    if (e && e.data && e.data.size > 0) {
      this.buffer.push(e.data);
    }
  }
  handleClickPlay() {
    const blob = new Blob(this.buffer, { type: "video/webm" });
    const $el: any = this.$refs.recordVideo;
    $el.src = window.URL.createObjectURL(blob);
    $el.play();
    $el.controls = true;
  }
  handleClickDownload(){
    // TODO: 
    const blob = new Blob(this.buffer, { type: "video/webm"})
    // TODO: 
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a');
    a.href = url;
    console.log(a);
    
    a.style.display = 'none'
    // TODO: ;
    a.download = 'test.webm'
    a.click()
  }
}
</script>

<style></style>
