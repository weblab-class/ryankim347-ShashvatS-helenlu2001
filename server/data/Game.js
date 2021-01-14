const { colors, colorMap, numColors, maxPlayers, gameDuration, fps } = require("../config");
const { getIo } = require("../server-socket");
const { Block } = require("./Block");
const { Player } = require("./Player");

class Game {
  constructor(code, host_id, host_name) {
    this.code = code; // game code
    this.host_id = host_id; // id of game creator

    this.mapWidth = 600;
    this.mapHeight = 600;


    this.players = [host_id];
    this.playerNames = {
      [host_id]: host_name,
    };

    this.id_to_color = {
      [host_id]: 0,
    };

    this.color_to_id = {
      0: host_id,
    };

    this.mode = "lobby";

    this.startTime = undefined;
    this.gameObjects = undefined;
    this.playerInfo = undefined;

    this.events = {};

    // this.updateGameState = this.updateGameState.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
  }

  join(clientId, name) {
    if (this.mode !== "lobby") return false;
    // Already in the game
    else if (clientId in this.playerNames) return true;
    else if (Object.values(this.playerNames).includes(name)) return false;
    else if (this.players.length >= maxPlayers) return false;

    this.players.push(clientId);
    this.playerNames[clientId] = name;

    for (let i = 0; i < numColors; ++i) {
      if (this.color_to_id[i] === undefined) {
        this.color_to_id[i] = clientId;
        this.id_to_color[clientId] = i;
        break;
      }
    }

    return true;
  }

  /**
   *
   * @param {*} clientId the client changing color
   * @param {*} newColor the newColor, must be between 0 and numColors
   */
  changeColor(clientId, newColor) {
    if (this.mode !== "lobby" || !(clientId in this.playerNames)) return;
    if (this.color_to_id[newColor] !== undefined) return;

    const oldColor = this.id_to_color[clientId];

    if (oldColor === undefined) {
      console.log("This should never happen; oldColor should always be defined");
      throw new Error("This should never happen; oldColor should always be defined");
    }

    delete this.color_to_id[oldColor];
    this.color_to_id[newColor] = clientId;
    this.id_to_color[clientId] = newColor;

    this.sendLobbyInformation();
  }

  validPlayer(clientId) {
    return clientId in this.playerNames;
  }

  isHost(clientId) {
    return clientId === this.host_id;
  }

  sendLobbyInformation() {
    const io = getIo();

    const data = {
      host_id: this.host_id,
      players: this.players,
      playerNames: this.playerNames,
      colors: this.color_to_id,
    };

    io.in(this.code).emit("lobby-data", data);
  }

  start() {
    const io = getIo();

    if (this.mode !== "lobby") return;
    this.mode = "playing";

    // TODO: Do stuff to actually start playing the game (initialization, etc)

    this.initializeGameObjects();
    this.initializePlayers();

    this.startTime = Date.now();

    io.in(this.code).emit("start-game", {});
    this.gameLoop();
  }

  initializeGameObjects() {
    this.gameObjects = {
      blocks: [
        new Block(20, 20),
        new Block(60, 20),
        new Block(100, 20),
        new Block(20, 60),
        new Block(20, 100),
        new Block(20, 140),
        new Block(400, 400),
        new Block(440, 400),
        new Block(400, 440),
        new Block(360, 400),
        new Block(400, 360),
      ],
    };
  }

  initializePlayers() {
    let i = 0;

    this.playerInfo = {};

    // TODO: shuffle, and actually place people in better spots
    for (const player in this.playerNames) {
      const posX = i * 100 + 300;
      const posY = i * 100 + 300;

      i += 1;

      this.playerInfo[player] = new Player(posX, posY, this.id_to_color[player]);
    }
  }

  newEvents(clientId, events) {
    if (clientId in this.events) {
      this.events[clientId].concat(events);
    } else {
      this.events[clientId] = events;
    }
  }

  /**
   * Do calculations to update the game state
   */
  updateGameState() {
    // Do some calculations

    // console.log(this.events);

    for (const player in this.events) {
      const events = this.events[player];

      // This logic is supposed to account for when one person switches directions super fast
      // But it can sometimes be kinda janky

      let doesStop = false;
      let doesMove = false;
      events.forEach((event) => {
        if (event.type === "stop") doesStop = true;
        else if (event.type === "movement") doesMove = true;
      });

      let ignoreStop = false;
      if (doesStop && doesMove) ignoreStop = true;

      events.forEach((event) => {
        if (event.type === "stop" && !ignoreStop) {
          this.playerInfo[player].setVel(0, 0);
        } else if (event.type === "movement") {
          this.playerInfo[player].setVel(event.vel.dx, event.vel.dy);
        }
      });
    }

    // Reset events to empty
    this.events = {};

    for (const player in this.playerInfo) {
      this.playerInfo[player].move(this.gameObjects.blocks);
    }
  }

  /**
   * Send new gameState to everyone
   */
  sendGameState() {
    const io = getIo();

    io.in(this.code).emit("game-update", {
      host_id: this.host_id,
      players: this.players,
      playerNames: this.playerNames,
      colors: this.color_to_id,
      playerInfo: this.playerInfo,
      gameObjects: this.gameObjects,
    });
  }

  gameLoop() {
    // console.log("Game loop");

    this.updateGameState();
    this.sendGameState();

    const elapsed = Date.now() - this.startTime;

    if (elapsed < gameDuration) {
      setTimeout(this.gameLoop, 1000 / fps);
    } else {
      this.mode = "finished";
      // TODO: do stuff that happens when the game is finished
    }
  }
}

module.exports = {
  Game,
};
