const cookie = require("cookie");
const { numColors } = require("./config");
const { games } = require("./data/games");

let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }

  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
};

const removeUser = (user, socket) => {
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);

      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });

      socket.on("join-room", (data) => {
        console.log(data);
        if (socket.request.headers.cookie === undefined) {
          return;
        }

        const cookies = cookie.parse(socket.request.headers.cookie);
        const clientId = cookies["client-id"];

        addUser(
          {
            _id: clientId,
          },
          socket
        );

        const { room } = data;

        if (games[room] == undefined) {
          return;
        }

        const game = games[room];

        if (game.validPlayer(clientId)) {
          socket.join(room);

          game.sendLobbyInformation();
        }
      });

      socket.on("color-change", (data) => {
        if (socket.request.headers.cookie === undefined) {
          return;
        }

        const cookies = cookie.parse(socket.request.headers.cookie);
        const clientId = cookies["client-id"];

        const { room, newColor } = data;

        if (games[room] == undefined || isNaN(newColor) || newColor < 0 || newColor >= numColors) {
          return;
        }

        const game = games[room];

        if (game.validPlayer(clientId)) {
          game.changeColor(clientId, newColor);
          // game.sendLobbyInformation();
        }
      });

      socket.on("start-game", (data) => {
        if (socket.request.headers.cookie === undefined) {
          return;
        }

        const cookies = cookie.parse(socket.request.headers.cookie);
        const clientId = cookies["client-id"];

        const { room, settings } = data;

        if (games[room] == undefined) {
          return;
        }

        const game = games[room];

        if (game.isHost(clientId)) {
          game.start(settings);
        }
      });

      socket.on("game-events", (data) => {
        if (socket.request.headers.cookie === undefined) {
          return;
        }

        const cookies = cookie.parse(socket.request.headers.cookie);
        const clientId = cookies["client-id"];

        const { room, events } = data;

        if (games[room] == undefined || clientId === undefined || events === undefined) {
          return;
        }

        const game = games[room];

        if (game.validPlayer(clientId)) {
          game.newEvents(clientId, events);
        }
      });

      socket.on("move", (dir) => {
        const user = getUserFromSocketID(socket.id);
        console.log("user id is " + user._id);
        console.log("data is " + dir);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
