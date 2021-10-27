<template>
  <div class="devices-container">
    <audio controls ref="audio">
      <source src="../../assets/audio/1244.mp3" type="audio/mpeg" />
    </audio>

    <div>
      <label for="">音频资源: </label>
      <select name="" id="audioSource">
        <option value="1">1</option>
      </select>
    </div>
    <div>
      <label for="">音频输出设备: </label>
      <select name="" id="audioOutput" @change="onChange">
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
      <select name="" id="audioInput">
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
      <select name="" id="videoOutput">
        <option
          v-for="device in videoinputDevices"
          :key="device.deviceId"
          :value="device.deviceId"
          >{{ device.label }}</option
        >
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import getDevices from "../../utils/getDevices";

@Options({})
export default class Devices extends Vue {
  audiooutputDevices: any = [];
  audioinputDevices: any = [];
  videoinputDevices: any = [];
  curAudioOutputId = "";

  onChange(event: any) {
    const id = event.target.value;
    this.curAudioOutputId = id;
    const el: any = this.$refs.audio;
    el.setSinkId(id);
  }

  created() {
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
      this.data = devicesInfo;
    });
    navigator.mediaDevices.addEventListener("devicechange", async () => {
      const devicesInfo: any = await getDevices();
      devicesInfo.forEach((device: any) => {
        if (device.deviceId === "default") {
          const el: any = this.$refs.audio;
          el.setSinkId(device.deviceId);
        }
      });
    });
  }
}
</script>

<style></style>
