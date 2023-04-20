<template>
  <div class="container">
    <div>本地视频</div>
    <div>
      <span>offer p1 sdp</span>
      <textarea name="" id="" cols="70" rows="10" v-model="pc1_SDP"></textarea>
    </div>
    <video autoplay playsinline ref="localvideo"></video>
    <div>远端视频</div>

    <div>
      <span>offer p1 sdp</span
      ><textarea name="" id="" cols="70" rows="10" v-model="pc2_SDP"></textarea>
    </div>

    <video autoplay playsinline ref="remotevideo"></video>
    <div>
      <button @click="handleClickStart">start</button>
      <button @click="handleClickCall">call</button>
      <button @click="handleClickHangup">hang up</button>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

export default class PeerConectton extends Vue {
  private localStream: any = null;
  private pc1: any = null; // local
  private pc2: any = null; // remote
  private pc1_SDP: any = null; // local sdp
  private pc2_SDP: any = null; // remote sdp
  handleClickStart() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("navigator.mediaDevices  不支持");
      return;
    }
    const constraints = {
      video: true,
      audio: false,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(this.getMediaStream)
      .catch(this.handleErr);
  }
  handleErr(err: any) {
    alert(`获取流失败 ${err}`);
  }

  getMediaStream(stream: any) {
    // 本地展示
    const $localvideo: any = this.$refs.localvideo;
    this.localStream = stream;
    console.log("zj ", stream);

    $localvideo.srcObject = stream;
  }

  handleClickCall() {
    this.pc1 = new RTCPeerConnection(); // RTCPeerConnection包含一些网络参数,但是本地测试 就不用传了
    this.pc2 = new RTCPeerConnection();

    // 双方都把对方可能连通的点(也就是candidate)保存在自己这里，然后再进行连通性测试
    this.pc1.onicecandidate = (e: any) => {
      console.log("zj pc1 onicecandidate");

      this.pc2.addIceCandidate(e.candidate);
    };
    this.pc2.onicecandidate = (e: any) => {
      console.log("zj pc2 onicecandidate");

      this.pc1.addIceCandidate(e.candidate);
    };
    this.pc2.ontrack = this.getRemoteStream;

    // 媒体协商需要有流的信息
    this.localStream.getTracks().forEach((track: any) => {
      console.log("zj 添加流");

      this.pc1.addTrack(track, this.localStream);
    });
    const offerOptions = {
      offerToReceiveAudio: 0,
      offerToReceiveVideo: 1,
    };
    this.pc1
      .createOffer(offerOptions)
      .then(this.getOffer)
      .catch(this.handleErr);
  }

  // 这个函数会有多个流
  getRemoteStream(e: any) {
    console.log("zj pc2 ontrack");

    const $remotevideo: any = this.$refs.remotevideo;
    $remotevideo.srcObject = e.streams[0];
  }

  getOffer(desc: any) {
    this.pc1_SDP = desc.sdp;
    this.pc1.setLocalDescription(desc);
    console.log("zj pc1 setLocalDescription");
    this.pc2.setRemoteDescription(desc);
    console.log("zj pc2 setRemoteDescription");

    this.pc2.createAnswer().then(this.getAnswer).catch(this.handleErr);
  }
  getAnswer(desc: any) {
    console.log("zj pc2 createAnswer");
    this.pc2_SDP = desc.sdp;

    this.pc2.setLocalDescription(desc);
    this.pc1.setRemoteDescription(desc);
  }

  handleClickHangup() {
    this.pc1.close();
    this.pc2.close();
    this.pc1 = null;
    this.pc2 = null;
  }
}
</script>

<style>
.container {
}
</style>
