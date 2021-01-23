const { colors, colorMap, numColors, maxPlayers, gameDuration, fps } = require("../config");
const { getIo } = require("../server-socket");
const { Block } = require("./Block");
const { Player } = require("./Player");
const { Bullet } = require("./Bullet");
const Map = require("../models/map");
const { Cloak } = require("./powerups/Cloak");
const { Speed } = require("./powerups/Speed");
const { Shrink } = require("./powerups/Shrink");

// new map design: map is split into 40x40 cells and we randomly pick a cell to place players in
class Game {
  constructor(code, host_id, host_name) {
    this.code = code; // game code
    this.host_id = host_id; // id of game creator

    this.mapWidth = 1200;
    this.mapHeight = 1200;

    //console.log(this.map.x[0])
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
    this.gameObjects = { blocks: [], bullets: [], powerups: [] };
    this.occupiedCells = new Set();
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

  start(settings) {
    const io = getIo();

    if (this.mode !== "lobby") return;
    this.mode = "playing";

    // TODO: Do stuff to actually start playing the game (initialization, etc)

    this.initializeGameObjects(settings);
    this.initializePlayers();

    this.startTime = Date.now();

    io.in(this.code).emit("start-game", { startTime: this.startTime });
    this.gameLoop();
  }

  initializeGameObjects(settings) {
    this.mapCount = 1;
    this.mapNum = Math.floor(Math.random() * this.mapCount) + 200;
    const query = { id: this.mapNum };
    this.gameObjects = {
      blocks: [],
      bullets: [],
      powerups: [],
    };


    if(!settings.standard) { // custom maps
      let blockArray = [];
      let powerupArray = [];

      for(let i = 0; i < settings.blocks.length; i++) {
        let block = settings.blocks[i];
        let xi = block.substring(0, block.indexOf(','));
        let yi = block.substring(block.indexOf(',') + 1);

        this.occupiedCells.add(xi + ',' + yi);
        blockArray.push(new Block(yi*40, xi*40));
        if (Math.random() < 0.2) {
          blockArray[i].makeMirror();
        }
      }

      for(let i = -1; i < settings.width+1; i++) {
        blockArray.push(new Block(i*40, -40));
        blockArray.push(new Block(i*40, settings.height*40));
      }

      for(let i = 0; i < settings.height; i++) {
        blockArray.push(new Block(-40, 40*i));
        blockArray.push(new Block(settings.width*40, 40*i));
      }

      for (let i = 0; i < 3; i++) {
        powerupArray.push(
          new Cloak(Math.floor(-200 + Math.random() * 1000), Math.floor(-200 + Math.random() * 1000))
        );
        powerupArray.push(
          new Speed(Math.floor(-200 + Math.random() * 1000), Math.floor(-200 + Math.random() * 1000))
        );
        powerupArray.push(
          new Shrink(Math.floor(-200 + Math.random() * 1000), Math.floor(-200 + Math.random() * 1000))
        );
      }

      this.gameObjects = {
        blocks: blockArray,
        bullets: [],
        powerups: powerupArray,
      };

    } else {
      Map.findOne(query).then((map) => {
        let blockArray = [];
        for (let i = 0; i < map.x.length; i++) {
          blockArray.push(new Block(map.x[i], map.y[i]));

          let xi = Math.floor(map.x[i] / 40);
          let yi = Math.floor(map.y[i] / 40);
          this.occupiedCells.add(xi + "," + yi);

          //TODO: change this to another way of deciding which blocks are mirrors
          // But this is prolly fine for now
          if (Math.random() < 0.1) {
            blockArray[i].makeMirror();
          }
        }
        let powerupArray = [];
        let c = null
        for (let i = 0; i < 1; i++) {
          c = this.validCoords(-200,800,blockArray)
          powerupArray.push(
            new Cloak(c[0],c[1])
          );
        }
        for (let i = 0; i < 1; i++) {
          c = this.validCoords(-200,800,blockArray)
          powerupArray.push(
            new Speed(c[0],c[1])
          );
        }
        for (let i = 0; i < 1; i++) {
          c = this.validCoords(-200,800,blockArray)
          powerupArray.push(
            new Shrink(c[0],c[1])
          );
        }
        this.gameObjects = {
          blocks: blockArray,
          bullets: [],
          powerups: powerupArray,
        };
      });
    }
  }

  initializePlayers() {
    let i = 0;

    this.playerInfo = {};

    // TODO: shuffle, and actually place people in better spots
    for (const player in this.playerNames) {
      let posX = Math.floor(Math.random() * 400) + 200;
      let posY = Math.floor(Math.random() * 400) + 200;

      while (
        this.occupiedCells.has(Math.floor(posX / 40 - 12) + "," + Math.floor(posY / 40 - 12))
      ) {
        posX = Math.floor(Math.random() * 400) + 200;
        posY = Math.floor(Math.random() * 400) + 200;
      }

      this.playerInfo[player] = new Player(
        this.playerNames[player],
        posX,
        posY,
        0,
        0,
        colorMap[colors[this.id_to_color[player]]]
      );
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
        } else if (event.type === "bullet") {
          if (this.playerInfo[player].canShoot()) {
            this.playerInfo[player].shoot();
            console.log('shooting')
            this.gameObjects.bullets.push(
              new Bullet(event.pos.x, event.pos.y, event.dir.dx, event.dir.dy, event.color)
            );
          }
        } else if (event.type === "dodge") {
          this.playerInfo[player].setDodge(event.pos.x,event.pos.y)
        }
      });
    }

    // Reset events to empty
    this.events = {};
    let points = [];
    for (const player in this.playerInfo) {
      this.playerInfo[player].move(
        this.gameObjects.blocks,
        Object.values(this.playerInfo),
        this.gameObjects.bullets,
        points,
        this.gameObjects.powerups
      );
    }

    //this line is inefficient for now, maybe we could have players be a dictionary mapping colors to players?
    points.forEach((color) => {
      for (const player in this.playerInfo) {
        if (this.playerInfo[player].color === color) {
          this.playerInfo[player].points += 1;
        }
      }
    });

    //TODO: this is inefficient, but its fine for now
    //Also, idk if deleting is the "proper" way, but it works for now

    const newBullets = [];

    for (let i = 0; i < this.gameObjects.bullets.length; i++) {
      if (this.gameObjects.bullets[i]) {
        const newBullet = this.gameObjects.bullets[i].move(this.gameObjects.blocks);

        if (newBullet != null && newBullet != undefined) {
          newBullets.push(newBullet);
        }
      }
    }

    let numDeleted = 0;
    for (let i = this.gameObjects.bullets.length - 1; i >= 0; i--) {
      if (this.gameObjects.bullets[i]) {
        if (!this.gameObjects.bullets[i].stillGoing) {
          delete this.gameObjects.bullets[i];
        }
      } else {
        numDeleted += 1;
      }
    }

    // Clean-up routine
    if (numDeleted / this.gameObjects.bullets.length > 0.75) {
      const bullets = this.gameObjects.bullets;
      this.gameObjects.bullets = [];
      for (let i = 0; i < bullets.length; ++i) {
        if (bullets[i]) {
          this.gameObjects.bullets.push(bullets[i]);
        }
      }
    }

    for (const newBullet of newBullets) {
      this.gameObjects.bullets.push(newBullet);
    }

    // remove all powerups that have been used
    let newPowerups = [];
    for (let i = this.gameObjects.powerups.length - 1; i >= 0; i--) {
      if (this.gameObjects.powerups[i]) {
        if (!this.gameObjects.powerups[i].isUsed()) {
          newPowerups.push(this.gameObjects.powerups[i]);
        }
      }
    }
    this.gameObjects.powerups = newPowerups;
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
  pushNewPowerup() {
    let powerUp = null;
    let pick = Math.floor(Math.random()*3);
    let v = this.validCoords(-200,800,this.gameObjects.blockArray)
    if (pick===0) {
      powerUp = new Cloak(v[0], v[1]);
    } else if (pick===1) {
      powerUp = new Speed(v[0], v[1]);
    } else if (pick===2) {
      powerUp = new Shrink(v[0], v[1]);
    }
    this.gameObjects.powerups.push(powerUp);
  }
  validCoords(low,high,blocks) {
    let x = Math.floor(low + Math.random() * (high-low));
    let y = Math.floor(low + Math.random() * (high-low));
    while(!this.checkValid(x,y,blocks)) {
      x = Math.floor(low + Math.random() * (high-low));
      y = Math.floor(low + Math.random() * (high-low));
    }
    return [x,y]
  }
  checkValid(x,y,blocks) {
    if(blocks) {
      let valid = true
      blocks.forEach((block) => {
        if (x>=block.x-25 && x<=block.x+block.s+50 && y>=block.y-25 && y<=block.y+block.s+50) {
          valid = false;
        }
      })
      return valid;
    }
    return true
  }
  gameLoop() {
    this.updateGameState();
    this.sendGameState();

    const elapsed = Date.now() - this.startTime;
    let odds = 1000
    if (Math.random()<1/odds) {
      this.pushNewPowerup()
    }
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
