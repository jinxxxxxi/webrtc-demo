<template>
  <div class="video-container">
    <video ref="video" playsinline autoplay />

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <td>视频</td>
            <td>约束</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(val, key, index) in videoConatraints" :key="index">
            <td>{{ stream }}</td>
            <td>
              <b>{{ key }}</b
              >:{{ val }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class App extends Vue {
  videoConatraints = {};
  stream = "undefined";
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

  /************************ 拿到视频约束  ***************************** */
  handleMediaStream(stream: any) {
    const $el: any = this.$refs.video;
    $el.srcObject = stream;
    const videoTrack = stream.getVideoTracks()[0];
    this.stream = JSON.stringify(stream);

    const videoConatraints = videoTrack.getSettings();
    this.videoConatraints = videoConatraints;
  }

  handleError(err: any) {
    console.log("err", err);
  }
}
</script>

<style>
.video-container {
  margin: 0 auto;
  width: 500px;
  height: 500px;
}
.video-container video {
  width: 100%;
  border-radius: 5px;
  border: 1px dashed greenyellow;
  /* background: black; */
}
.video-container audio {
  width: 100%;
  /* background: black; */
}
.video-container .blur {
  filter: blur(5px);
}
.video-container .grayscale {
  filter: grayscale(50%);
}
.video-container .invert {
  filter: invert(75%);
}
.video-container .sepia {
  filter: sepia(60%);
}
.video-container .contrast {
  filter: contrast(120%);
}
.video-container .drop-shadow {
  filter: drop-shadow(16px 16px 20px blue);
}
.video-container .saturate {
  filter: saturate(30%);
}
.video-container .hue-rotate {
  filter: hue-rotate(90deg);
}
table,
tr,
td {
  border: 1px solid #ccc;
  border-collapse: collapse;
  text-align: left;
}
</style>
