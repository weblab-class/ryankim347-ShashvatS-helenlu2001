import React, { Component } from "react";

import Player from "./Player.js";
import Block from "./Block.js";
import Bullet from "./Bullet.js";
import Cloak from "./powerups/Cloak.js";
import Speed from "./powerups/Speed.js";

import "../../utilities.css";
import "./Canvas.css";
import { socket } from "../../client-socket.js";
import Shrink from "./powerups/Shrink.js";

/**
 * @param userId specifies the id of the currently logged in user
 */

// TODO: modularize the code more and maybe make a new component for the person!

// https://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas

class Canvas extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.poseHeight = 100;
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
    this.mouseX = 0;
    this.mouseY = 0;
    this.me = new Player(0, 0, this.props.color);
    this.eventLoop();
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("mousemove", this.handleMouseMove);

    this.drawLoop();
  }

  handleKeyDown(event) {
    if (event.code === "Space") {
      console.log(this.me.x, this.me.dodgeX);
      this.events.push({
        type: "bullet",
        dir: {
          dx: this.dx,
          dy: this.dy,
        },
        pos: {
          x: this.me.x + this.me.dodgeX * 24,
          y: this.me.y + this.me.dodgeY * 24,
        },
        color: this.me.color,
      });
    }
  }
  handleMouseMove(event) {
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;
    let dx = this.mouseX - window.innerWidth / 2;
    let dy = this.mouseY - (window.innerHeight - this.poseHeight) / 2;
    let mag = Math.sqrt(dx * dx + dy * dy);
    dx = dx / mag;
    dy = dy / mag;

    this.dx = dx;
    this.dy = dy;

    if ((dx != 0 || dy != 0) && mag > 5) {
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
    let dx = this.mouseX - window.innerWidth / 2;
    let dy = this.mouseY - (window.innerHeight - this.poseHeight) / 2;
    let mag = Math.sqrt(dx * dx + dy * dy);
    if (mag < 5) {
      this.events.push({
        type: "movement",
        vel: {
          dx: 0,
          dy: 0,
        },
      });
    }
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
    if (this.refs.canvas == undefined) {
      console.log("undefined");
    } else {
      const ctx = this.refs.canvas.getContext("2d");

      if (this.me.powerups) {
        if (this.me.powerups.invisible) {
          ctx.globalAlpha = 0.5;
        }
      } else {
        ctx.globalAlpha = 1;
      }
      ctx.fillRect(0, 0, 2 * ctx.canvas.width, 2 * ctx.canvas.height);
      let relX = this.me.x - window.innerWidth / 2;
      let relY = this.me.y - window.innerHeight / 2;
      if (this.playerInfo === undefined || this.gameObjects === undefined) {
        // Do nothing
      } else {
        // Do stuff

        for (let player in this.playerInfo) {
          this.playerInfo[player].draw(ctx, relX, relY);
          if (this.playerInfo[player].color === this.me.color && this.playerInfo[player].powerups) {
            if (this.playerInfo[player].powerups.invisible) {
              ctx.globalAlpha = 0.5;
            } else {
              ctx.globalAlpha = 1;
            }
          } else {
            ctx.globalAlpha = 1;
          }
        }
        this.gameObjects.bullets.forEach((bullet) => bullet.draw(ctx, relX, relY));
        this.gameObjects.blocks.forEach((block) => block.draw(ctx, relX, relY));
        this.gameObjects.powerups.forEach((powerup) => powerup.draw(ctx, relX, relY));
      }
    }

    if (this.running) {
      setTimeout(this.drawLoop, 1000 / 30);
    }
  }

  receiveUpdate(data) {
    const { playerInfo, gameObjects, playerNames, colors } = data;
    this.playerInfo = {};
    let leaderboardInfo = [];

    for (const player in playerInfo) {
      leaderboardInfo.push({
        color: playerInfo[player].color,
        points: playerInfo[player].points,
        name: playerInfo[player].name,
        deaths: playerInfo[player].deaths,
      });

      if (playerInfo[player].color === this.props.color) {
        this.me = new Player(
          playerInfo[player].color === this.props.color,
          playerInfo[player].x,
          playerInfo[player].y,
          playerInfo[player].color,
          playerInfo[player].dodgeX,
          playerInfo[player].dodgeY
        );
      }
      this.playerInfo[player] = new Player(
        playerInfo[player].color === this.props.color,
        playerInfo[player].x,
        playerInfo[player].y,
        playerInfo[player].color,
        playerInfo[player].dodgeX,
        playerInfo[player].dodgeY,
        playerInfo[player].shot,
        playerInfo[player].velX,
        playerInfo[player].velY,
        playerInfo[player].isDead,
        playerInfo[player].powerups,
        playerInfo[player].r
      );
    }

    this.gameObjects = {
      blocks: [],
      bullets: [],
      powerups: [],
    };
    gameObjects.bullets.forEach((bullet) => {
      if (bullet) {
        this.gameObjects.bullets.push(
          new Bullet(bullet.x, bullet.y, bullet.velX, bullet.velY, bullet.color, !bullet.stillGoing)
        );
      }
    });
    gameObjects.blocks.forEach((block) => {
      this.gameObjects.blocks.push(new Block(block.x, block.y, block.mirror));
    });
    gameObjects.powerups.forEach((powerup) => {
      switch (powerup.type) {
        case "cloak":
          this.gameObjects.powerups.push(new Cloak(powerup.x, powerup.y));
          break;
        case "speed":
          this.gameObjects.powerups.push(new Speed(powerup.x, powerup.y));
          break;
        case "shrink":
          this.gameObjects.powerups.push(new Shrink(powerup.x, powerup.y));
          break;
      }
    });

    this.props.updateLeaderboard(leaderboardInfo);
  }

  componentWillUnmount() {
    socket.off("game-update", this.receiveUpdate);
    this.running = false;
  }

  render() {
    return (
      <>
        <div className="Canvas-container">
          <canvas
            ref="canvas"
            width={window.innerWidth}
            height={window.innerHeight - this.poseHeight}
          />
        </div>
      </>
    );
  }
}

export default Canvas;
