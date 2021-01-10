import socketIOClient from "socket.io-client";
import { currentRoom } from "./global";
import { post } from "./utilities";

const endpoint = window.location.hostname + ":" + window.location.port;

export const socket = socketIOClient(endpoint);

socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });

  if (currentRoom.room != undefined) {
    socket.emit("rejoin-room", {
      room: currentRoom.room,
    });
  }
});
