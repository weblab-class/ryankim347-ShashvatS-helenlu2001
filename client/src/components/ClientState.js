const RENDER_DELAY = 100;

// Code here is adapted from https://victorzhou.com/blog/build-an-io-game-part-1/

function interpolate(cur, next, r) {
  console.log("is it breaking here????");

  const ans = {
    time: cur.time * (1 - r) + next.time * r,
    host_id: cur.host_id,
    players: cur.players,
    playerNames: cur.playerNames,
    colors: cur.color_to_id,
  };

  //TODO: better interpolation of gameObjects

  // Hard to do because bullets and powerups are stored in arrays currently, so it hard to interpolate
  const gameObjects = r >= 0.5 ? next.gameObjects : cur.gameObjects;

  function interpolatePlayer(cur, next, r) {
    const ans = r >= 0.5 ? next : cur;

    const keys = ["x", "y", "dodgeX", "dodgeY", "shootX", "shootY", "r", "respawnTimer"];

    for (const key of keys) {
      ans[key] = cur[key] * (1 - r) + next[key] * r;
    }

    return ans;
  }

  const playerInfo = {};
  for (const player of Object.keys(cur.playerInfo)) {
    playerInfo[player] = interpolatePlayer(cur.playerInfo[player], next.playerInfo[player], r);
  }

  ans.gameObjects = gameObjects;
  ans.playerInfo = playerInfo;

  return ans;
}

class ClientState {
  constructor() {
    this.gameUpdates = [];
    this.gameStart = 0;
    this.firstServerTimeStamp = 0;
  }

  newState(state) {
    if (!this.firstServerTimeStamp) {
      this.firstServerTimeStamp = state.time;
      this.gameStart = Date.now();
    }

    this.gameUpdates.push(state);

    // Keep only one game update before the current server time
    const base = this.getBaseUpdate();
    if (base > 0) {
      this.gameUpdates.splice(0, base);
    }
  }

  currentServerTime() {
    return this.firstServerTimestamp + (Date.now() - this.gameStart) - RENDER_DELAY;
  }

  getBaseUpdate() {
    const serverTime = this.currentServerTime();
    for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
      if (this.gameUpdates[i].time <= serverTime) {
        return i;
      }
    }
    return -1;
  }

  getState() {
    if (this.firstServerTimestamp === 0) {
      return null;
    }

    const base = this.getBaseUpdate();
    const serverTime = this.currentServerTime();

    // If base is the most recent update we have, use its state.
    // Else, interpolate between its state and the state of (base + 1).
    if (base < 0) {
      return this.gameUpdates[this.gameUpdates.length - 1];
    } else if (base === this.gameUpdates.length - 1) {
      return this.gameUpdates[base];
    } else {
      const baseUpdate = this.gameUpdates[base];
      const next = this.gameUpdates[base + 1];
      const r = (serverTime - baseUpdate.time) / (next.time - baseUpdate.time);

      return interpolate(baseUpdate, next, r);
    }
  }
}

export default ClientState;
