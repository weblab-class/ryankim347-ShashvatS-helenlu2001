// note -- n stands for neon and p stands for pastel
const colors = [
  "npink",
  "nyellow",
  "ngreen",
  "nblue",
  "norange",
  "npurple",
  "ppink",
  "pyellow",
  "pgreen",
  "pblue",
  "porange",
  "grey",
];

const colorMap = {
  npink: "#FF00D0",
  nyellow: "#FFFF00",
  ngreen: "#00FF00",
  nblue: "#00D0FF",
  norange: "#FFAA00",
  npurple: "#BB00FF",

  ppink: "#FED4FF",
  pyellow: "#FFFFAB",
  pgreen: "#C4FFC4",
  pblue: "#C2F4FF",
  porange: "#FFE1A6",
  grey: "#D1D1D1",
};

module.exports = {
  colors: colors,
  colorMap: colorMap,
  numColors: 12,
  maxPlayers: 10,
  fps: 60,
};
