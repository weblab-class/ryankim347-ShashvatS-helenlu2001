class Game {
  constructor(code, host_id, name) {
    this.code = code;
    this.host_id = host_id;
    this.players = [host_id];
    this.playerNames = {
      host_id: name,
    };
  }

  join(clientId, name) {
    if (Object.values(this.playerNames).includes(name)) return false;
    else if (clientId in this.players) return false;
    else if (this.players.length >= 10) return false;

    this.players.push(clientId);
    this.playerNames[clientId] = name;

    return true;
  }
}

module.exports = {
  Game,
};
