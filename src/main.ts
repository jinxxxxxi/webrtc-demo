import { createApp } from "vue";
// import socketio from "socket.io-client";
import App from "./App.vue";
// import App from "./components/HelloWorld.vue";
import store from "./store";
// import VueSocketio from "vue-socket.io";
const app = createApp(App);
// app.use(
//   new VueSocketio({
//     debug: true,
//     // 服务器端地址
//     connection: "http://localhost:3000",
//   })
// );

// app.provide("$socket", socketio);
app.use(store);
app.mount("#app");
