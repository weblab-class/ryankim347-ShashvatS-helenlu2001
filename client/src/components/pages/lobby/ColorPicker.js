import React from "react";
import { socket } from "../../../client-socket";
import "./ColorPicker.css";
import '../../../utilities.css';

const colors = [ 'npink', 'nyellow', 'ngreen', 'nblue', 'norange', 'npurple', 'ppink', 'pyellow', 'pgreen', 'pblue', 'porange', 'grey']

const colorToHex = {
  'npink': '#FF00D0',
  'nyellow': '#FFFF00',
  'ngreen' : '#00FF00',
  'nblue': '#00D0FF',
  'norange': '#FFAA00',
  'npurple': '#BB00FF',

  'ppink': '#FED4FF',
  'pyellow': '#FFFFAB',
  'pgreen': '#C4FFC4',
  'pblue': '#C2F4FF',
  'porange': '#FFE1A6',
  'grey': '#D1D1D1'
}

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
    <>
      <div className='ColorPicker-spacer'> </div>
      <div className='ColorPicker-container u-textCenter'>
        <div className='u-heading'> — PICK YOUR COLOR — </div>
        <div className='ColorPicker-colorContainer'>
          {list.map((i) => (
              <div
                key={i}
                className='ColorPicker-color'
                style={{ backgroundColor: colorToHex[colors[i]] }}
                onClick={() => {
                  changeColor(code, i, colorMap);
                }}
              >
                {colorMap[i] === undefined ? '' : 'X'}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
