const { getIo } = require("../server-socket");

class Game {
  constructor(code, host_id, name) {
    this.code = code;
    this.host_id = host_id;
    this.players = [host_id];
    this.playerNames = {
      [host_id]: name,
    };

    this.mode = "lobby";
  }

  join(clientId, name) {
    if (this.mode !== "lobby") return false;
    // Already in the game
    else if (clientId in this.playerNames) return true;
    else if (Object.values(this.playerNames).includes(name)) return false;
    else if (this.players.length >= 10) return false;

    this.players.push(clientId);
    this.playerNames[clientId] = name;

    return true;
  }

  validPlayer(clientId) {
    return clientId in this.playerNames;
  }

  sendLobbyInformation() {
    const io = getIo();
    const data = {
      host_id: this.host_id,
      players: this.players,
      playerNames: this.playerNames,
    };

    io.in(this.code).emit("lobby-data", data);
  }
}

module.exports = {
  Game,
};
