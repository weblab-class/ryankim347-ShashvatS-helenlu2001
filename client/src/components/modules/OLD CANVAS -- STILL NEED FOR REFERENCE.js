import React, { Component } from "react";


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
        x: 600,
        y: 600,
        dx: 0,
        dy: 0,
        dir: 4,
        blobs: []
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.translate(-300,-300)
    // ctx.arc(600,600,400,0,2*Math.PI);
    ctx.arc(this.state.x, this.state.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    window.addEventListener('keydown', this.handleKeyPress);

    let blob = [];
    for(let i = 0; i < 20; i++) {
        let x = Math.floor(Math.random() * ctx.canvas.width) + 301;
        let y = Math.floor(Math.random() * ctx.canvas.width) + 301;
        ctx.moveTo(x,y);
        ctx.arc(x,y,2,0,2*Math.PI);
        ctx.stroke();
        blob.push([x,y]);
    }
    this.setState({blobs: blob});
    ctx.moveTo(this.state.x, this.state.y);

  }

  handleKeyPress(event) {
    const ctx = this.refs.canvas.getContext('2d');
    const code = event.keyCode;
    let dx = 0;
    let dy = 0;
    let sx = 0;
    let sy = 0;
    if(code === 37) { // left
        dx -= 2;
        this.setState({dir: 1});
    } else if (code === 38) { // up
        dy -= 2;
        this.setState({dir: 2});

    } else if (code === 39) { // right
        dx += 2;
        this.setState({dir: 3});

    } else if (code === 40) { // down
        dy += 2;
        this.setState({dir: 4});

    } else if (code === 32) { // space
        switch(this.state.dir) {
            case 1:
                sx = -1;
                break;
            case 2:
                sy = -1;
                break;
            case 3:
                sx += 1;
                break;
            case 4:
                sy += 1;
                break;
        }
        let imageData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);

        ctx.moveTo(this.state.x, this.state.y);
        ctx.lineTo(this.state.x+sx*150, this.state.y+sy*150);
        ctx.stroke();
        setTimeout(function () {
            // return the canvas to the state right after we drew the blue rect
            ctx.putImageData(imageData, 0, 0);
        }, 100);

        ctx.moveTo(this.state.x, this.state.y);
    }

    if(!(dx == 0 && dy == 0)) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0,0,2*ctx.canvas.width, 2*ctx.canvas.height);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.state.x + dx,this.state.y + dy,10,0,2*Math.PI);
        ctx.stroke();
        this.setState({
            x: this.state.x + dx,
            y: this.state.y + dy,
            dx: this.state.dx + dx,
            dy: this.state.dy + dy
        });

        for(let i = 0; i< this.state.blobs.length; i++) {
            let x = this.state.blobs[i][0];
            let y = this.state.blobs[i][1];
            ctx.moveTo(x-dx,y-dy);
            ctx.arc(x-dx,y-dy,2,0,2*Math.PI);
            ctx.stroke();
            console.log('blob ' + i + ' : ' + x + ' ' + y);
        }
        ctx.moveTo(this.state.x, this.state.y);
        ctx.translate(-dx, -dy);
        console.log(this.state.x + ", " + this.state.y);
        console.log('dx and dy: ' + dx + ' ' + dy)
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
