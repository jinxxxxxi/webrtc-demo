<template>
  <div>
    <!-- <ChattingRoom /> -->
    <!-- <RecordTable /> -->
    <!-- <MediaRecorder /> -->
    <!-- <GetMediaStream /> -->
    <GetUserMedia />
    <!-- <Devices /> -->
  </div>
</template>

<script>
import { Options, Vue } from "vue-class-component";
import Devices from "@/views/Device/Devices.vue";
import GetUserMedia from "@/views/Device/GetUserMedia.vue";
import GetMediaStream from "@/views/Device/GetMediaStream.vue";
import MediaRecorder from "@/views/Record/MediaRecorder.vue";
import RecordTable from "@/views/Record/RecordTable.vue";
import ChattingRoom from "@/views/ChattingRoom/Index.vue";

@Options({
  components: {
    GetUserMedia,
    Devices,
    GetMediaStream,
    MediaRecorder,
    RecordTable,
    ChattingRoom,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
