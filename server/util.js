const gamePinLength = 6;

function genGamePin() {
  let str = "";
  for (let i = 0; i < gamePinLength; i++) {
    let int = Math.floor(Math.random() * 10);
    str = str + int;
  }
  return str;
}

function getClientId(req) {
  return req.cookies["client-id"];
}

function genCoordinates(mapWidth, mapHeight) {
  return {X: Math.floor(Math.random() * mapWidth), Y: Math.floor(Math.random() * mapHeight)};
}

module.exports = { genGamePin, getClientId, genCoordinates };
