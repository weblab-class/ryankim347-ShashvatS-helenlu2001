import React, { Component } from "react";

import Player from './Player.js';
import Block from './Block.js';

import "../../utilities.css";
import './Canvas.css';

/**
 * @param userId specifies the id of the currently logged in user
 */

 // TODO: modularize the code more and maybe make a new component for the person!

 // https://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas

class Canvas extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      player: new Player(),
      blocks: [new Block(20, 20), new Block(60,20), new Block(100,20), new Block(20, 60), new Block(20, 100), new Block(20, 140), new Block(400, 400), new Block(440, 400), new Block(400, 440), new Block(360, 400), new Block(400, 360)]
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress);
    const ctx = this.refs.canvas.getContext('2d');
    this.state.player.draw(ctx);
    for(let i = 0; i < this.state.blocks.length; i ++) {
      this.state.blocks[i].draw(ctx);
    }


  }

  handleKeyPress(event) {
    const code = event.keyCode;

    let dx = 0;
    let dy = 0;

    // checks if typed the arrows
    if(code === 37) { // left
        dx -= 1;
    } else if (code === 38) { // up
        dy -= 1;
    } else if (code === 39) { // right
        dx += 1;
    } else if (code === 40) { // down
        dy += 1;
    }

    // actually moved
    if(dx != 0 || dy != 0) {
      this.state.player.move(dx, dy);

      // TODO: eventually move the drawing outside the movement part!
      const ctx = this.refs.canvas.getContext('2d');
      ctx.fillRect(0,0,2*ctx.canvas.width, 2*ctx.canvas.height);
      this.state.player.draw(ctx);
      for(let i = 0; i < this.state.blocks.length; i ++) {
        this.state.blocks[i].draw(ctx);
      }
    }



  }

  render() {
    return (
      <>
        <div className='Canvas-container'>
            <canvas ref='canvas' width={600} height={600}/>
        </div>
      </>
    );
  }
}

export default Canvas;
