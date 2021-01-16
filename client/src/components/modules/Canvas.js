import React, { Component } from "react";

import Player from "./Player.js";
import Block from "./Block.js";

import "../../utilities.css";
import "./Canvas.css";
import { socket } from "../../client-socket.js";

/**
 * @param userId specifies the id of the currently logged in user
 */

// TODO: modularize the code more and maybe make a new component for the person!

// https://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas

class Canvas extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State

    this.running = true;
    this.events = [];

    this.eventLoop = this.eventLoop.bind(this);
    this.drawLoop = this.drawLoop.bind(this);
    this.receiveUpdate = this.receiveUpdate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    socket.on("game-update", this.receiveUpdate);

    this.playerInfo = undefined;
    this.gameObjects = undefined;

    this.dx = undefined;
    this.dy = undefined;

    this.eventLoop();
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener('mousemove', this.handleMouseMove);

    this.drawLoop();
  }

  handleKeyDown(event) {
    if(event.code === 'Space') {
      this.events.push({
        type: 'shoot',
        dir: {
          dx: this.dx,
          dy: this.dy
        }
      })
      console.log('shoot');
      console.log(this.dx + ' ' + this.dy)
    }
  }

  handleMouseMove(event) {
    let mouseX = event.pageX;
    let mouseY = event.pageY;

    let dx = mouseX - this.me.x - window.innerWidth/2 + 300;
    let dy = mouseY - this.me.y - 70;
    let mag = Math.sqrt(dx*dx + dy*dy);
    dx = dx / mag;
    dy = dy / mag;

    this.dx = dx;
    this.dy = dy;


    if (dx != 0 || dy != 0) {
      this.events.push({
        type: "movement",
        vel: {
          dx,
          dy,
        },
      });
    }

  }



  eventLoop() {
    // First, process all of the events

    if (this.events.length > 0) {
      socket.emit("game-events", {
        room: this.props.code,
        events: [...this.events],
      });
    }

    this.events = [];

    if (this.running) {
      setTimeout(this.eventLoop, 60);
    }
  }

  drawLoop() {
    const ctx = this.refs.canvas.getContext("2d");
    ctx.fillRect(0, 0, 2 * ctx.canvas.width, 2 * ctx.canvas.height);

    if (this.playerInfo === undefined || this.gameObjects === undefined) {
      // Do nothing
    } else {
      // Do stuff

      for (let player in this.playerInfo) {
        this.playerInfo[player].draw(ctx);
      }

      this.gameObjects.blocks.forEach((block) => block.draw(ctx));
    }

    if (this.running) {
      setTimeout(this.drawLoop, 1000 / 30);
    }
  }

  receiveUpdate(data) {
    const { playerInfo, gameObjects, playerNames, colors } = data;

    this.playerInfo = {};

    for (const player in playerInfo) {

      if(playerInfo[player].color === this.props.color) {
        this.me =  new Player(playerInfo[player].x, playerInfo[player].y, playerInfo[player].color);
      }
      this.playerInfo[player] = new Player(playerInfo[player].x, playerInfo[player].y, playerInfo[player].color, playerInfo[player].shot, playerInfo[player].velX, playerInfo[player].velY);
    }

    this.gameObjects = {
      blocks: [],
    };

    gameObjects.blocks.forEach((block) => {
      this.gameObjects.blocks.push(new Block(block.x, block.y));
    });
  }

  componentWillUnmount() {
    socket.off("game-update", this.receiveUpdate);
  }

  render() {
    return (
      <>
        <div className="Canvas-container">
          <canvas ref="canvas" width={600} height={600} />
        </div>
      </>
    );
  }
}

export default Canvas;
