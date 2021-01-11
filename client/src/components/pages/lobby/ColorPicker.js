import React from "react";
import { socket } from "../../../client-socket";

const colors = [
  "silver",
  "gray",
  "white",
  "red",
  "purple",
  "fuchsia",
  "green",
  "lime",
  "yellow",
  "navy",
  "teal",
  "aqua",
];

function changeColor(code, newColor, colorMap) {
  if (colorMap[newColor] === undefined) {
    socket.emit("color-change", {
      room: code,
      newColor,
    });
  }
}

const ColorPicker = (props) => {
  const { code, colorMap, names } = props;

  const list = [];
  for (let i = 0; i < 12; ++i) {
    list.push(i);
  }
  return (
    <div>
      Pick your color lol
      <div>
        {list.map((i) => (
          <button
            key={i}
            style={{ color: colors[i] }}
            onClick={() => {
              changeColor(code, i, colorMap);
            }}
          >
            {colorMap[i] === undefined ? "Empty" : names[colorMap[i]]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
