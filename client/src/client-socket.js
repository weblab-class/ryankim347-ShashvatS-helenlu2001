import socketIOClient from "socket.io-client";
import { post } from "./utilities";

const endpoint = window.location.hostname + ":" + window.location.port;

export const socket = socketIOClient(endpoint);

socket.on("connect", () => {
  console.log("connecting yo");
});

socket.on("disconnect", () => {
  console.log("disconnecting...");
});

export function move(dir) {
  socket.emit("move", dir);
}
