import React, { Component } from "react";
import PoseNet from "react-posenet";
import "./PoseHandler.css";
import events from "./event";

/**
 * @param code specifies the code of the current game
 */
class PoseHandler extends Component {
  constructor(props) {
    super(props);
    this.events = [];
    this.height = 480;
    this.width = 640;
    this.getDims();
    this.state = {
      loaded: false,
    };
    this.running = true;

    this.fps = 1;
    this.passInfo = this.passInfo.bind(this);
    this.drawLoop = this.drawLoop.bind(this);
  }

  getDims() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      this.height = stream.getVideoTracks()[0].getSettings().height;
      this.width = stream.getVideoTracks()[0].getSettings().width;
      console.log(this.height, this.width);
    });
  }

  average(array) {
    return array.reduce((a, b) => a + b) / array.length;
  }

  componentDidMount() {
    this.drawLoop();
  }

  drawLoop() {
    if (this.refs.canvas2) {
      const canvas2 = this.refs.canvas2;
      const ctx = canvas2.getContext("2d");

      // ctx.beginPath();
      // ctx.strokeStyle = "white"
      // ctx.lineWidth = "6";
      // ctx.rect(0,0,150,150*this.height/this.width)
      // ctx.stroke()
    }

    if (this.running) {
      setTimeout(this.drawLoop, 1000 / this.fps);
    }
  }

  componentWillUnmount() {
    this.running = false;
  }

  passInfo(poses) {
    let faceX = null;
    let faceY = null;

    poses.forEach((pose) => {
      let keyX = [];
      let keyY = [];
      pose.keypoints.forEach((point) => {
        if (point.part === "nose" || point.part === "leftEye" || point.part === "rightEye") {
          keyX.push(point.position.x);
          keyY.push(point.position.y);
        }
      });
      if (keyX.length > 0) {
        faceX = this.average(keyX);
        faceY = this.average(keyY);
      }

      this.pointX = keyX;
      this.pointsY = keyY;
    });

    if (faceX) {
      let relX = (faceX - this.width / 2) / (this.width / 2);
      let relY = (faceY - this.height / 2) / (this.height / 2);

      events.push({
        type: "dodge",
        pos: {
          x: -relX,
          y: relY,
        },
      });
    } else {
      console.log("Face not found");
    }

    if (!this.state.loaded) {
      this.setState({ loaded: true });
    }
  }

  render() {
    return (
      <div>
        <PoseNet frameRate={this.fps} className="PoseHandler-cam" onEstimate={this.passInfo} />
        <canvas
          ref="canvas2"
          className="PoseHandler-visualizer"
          width={150}
          height={(150 * this.height) / this.width}
        />
      </div>
    );
  }
}

export default PoseHandler;
