<template>
  <div class="video-container">
    <video ref="video" playsinline autoplay />
    <div>
      <label for="">音频输出设备: </label>
      <select name="" id="audioOutput" @change="onAudioChange">
        <option
          v-for="device in audiooutputDevices"
          :key="device.deviceId"
          :value="device.deviceId"
          >{{ device.label }}</option
        >
      </select>
    </div>
    <div>
      <label for="">音频输入设备: </label>
      <select name="" id="audioInput" @change="onAudioChange">
        <option
          v-for="device in audioinputDevices"
          :key="device.deviceId"
          :value="device.deviceId"
          >{{ device.label }}</option
        >
      </select>
    </div>
    <div>
      <label for="">视频输出设备: </label>
      <select name="" id="videoOutput" @change="onVideoChange">
        <option
          v-for="device in videoinputDevices"
          :key="device.deviceId"
          :value="device.deviceId"
          >{{ device.label }}</option
        >
      </select>
    </div>
    <!-- NOTE:  CSS filter -->
    <div>
      <label for="">特效选择: </label>
      <select name="" @change="onEffectChange">
        <option
          v-for="(effect, index) in videoSpecialEffect"
          :key="index"
          :value="effect"
          >{{ effect }}</option
        >
      </select>
    </div>
    <div>
      <img
        src="../../assets/image/a.jpg"
        style="display:none"
        alt=""
        ref="img"
      />
      <button @click="handleClickSnapShot">视频截图</button>
      <canvas ref="picture" style="width:500px;height:400px"></canvas>
      <canvas ref="canvas" style="width:500px;height:400px"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import getDevices from "../../utils/getDevices";
import { interval } from "@/utils/tools";

// NOTE:
/******************* 采集用户音视频**************/
@Options({})
export default class App extends Vue {
  audiooutputDevices: any = []; // 音频输出设备列表
  audioinputDevices: any = []; // 音频输入设备列表
  videoinputDevices: any = []; // 视频输出设备列表
  curAudioOutputId = ""; //选中的音频设备
  curVideoOutputId = ""; // 选中的视频设备
  videoSpecialEffect = [
    "none",
    "blur",
    "grayscale",
    "invert",
    "sepia",
    "contrast",
    "drop-shadow",
    "saturate",
    "hue-rotate",
  ]; // 特效列表
  curEffect = ""; // 当前特效

  created() {
    this.getUserMedia();
  }

  // NOTE:
  /******************* 视频特效**************/

  onEffectChange(event: any) {
    this.curEffect = event.target.value;
    const $el: any = this.$refs.video;
    $el.className = event.target.value;
  }
  onAudioChange(event: any) {
    const id = event.target.value;
    this.curAudioOutputId = id;
    this.audiooutputDevices = [];
    this.audioinputDevices = [];
    this.videoinputDevices = [];
    this.getUserMedia();
  }
  onVideoChage(event: any) {
    const id = event.target.value;
    this.curVideoOutputId = id;
    this.audiooutputDevices = [];
    this.audioinputDevices = [];
    this.videoinputDevices = [];
    this.getUserMedia();
  }
  handleClickSnapShot(event: any) {
    const $canvas: any = this.$refs.picture;
    const $canvas2: any = this.$refs.canvas;
    const $el: any = this.$refs.video;
    const $img: any = this.$refs.img;
    const ctx: any = $canvas.getContext("2d");
    const ctx2: any = $canvas2.getContext("2d");

    function start() {
      // let img = new Image();
      // img.src = "../../assets/image/a.jpg";
      ctx.drawImage($el, 0, 0, $canvas.width, $canvas.height);
      ctx.drawImage($img, 200, 100, 60, 60);
      // const frame = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
      // console.log(frame.data);

      // ctx.putImageData(img, 100, 100);
      // }
    }

    interval(function() {
      start();
    }, 66);

    // const dataURL = $canvas.toDataURL("image/png", 1.0);
    // console.log(dataURL);
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
        frameRate: { min: 15, max: 30 },
        deviceId: this.curVideoOutputId || undefined,
      },
      audio: {
        noiseSuppression: true,
        echoCancellation: true,
        // TODO: 这里切换音频好像不起作用
        deviceId: this.curAudioOutputId ? this.curAudioOutputId : undefined,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constrants)
      .then(this.handleMediaStream)
      .catch(this.handleError);
  }

  handleMediaStream(stream: any) {
    const $el: any = this.$refs.video;
    $el.srcObject = stream;
    this.setDevice();
  }
  // NOTE:
  /******************* 针对苹果、火狐这类浏览器，必须先通过getUserMedia来设置流之后，才能再拿到设备资源**************/

  setDevice() {
    getDevices().then((devicesInfo: any) => {
      devicesInfo.forEach((device: any) => {
        if (device.kind === "audiooutput") {
          this.audiooutputDevices.push(device);
        } else if (device.kind === "audioinput") {
          this.audioinputDevices.push(device);
        } else if (device.kind === "videoinput") {
          this.videoinputDevices.push(device);
        }
      });
    });
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
</style>
