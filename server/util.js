const gamePinLength = 6;

function genGamePin() {
  let str = "";
  for (let i = 0; i < gamePinLength; i++) {
    let int = Math.floor(Math.random() * 10);
    str = str + int;
  }
  return str;
}

module.exports = { genGamePin };
