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

module.exports = { genGamePin, getClientId };
