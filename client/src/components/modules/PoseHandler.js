import React, { Component } from "react";
// import { socket } from "../../client-socket.js";
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
    this.setState({
      pointsX: null,
      pointsY: null,
      loaded: false
    })
    this.running = true
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
    const canvas2 = this.refs.canvas2
    const ctx = canvas2.getContext("2d")
    this.drawLoop()
  }
  drawLoop() {
    if (this.refs.canvas2) {
      const canvas2 = this.refs.canvas2
      const ctx = canvas2.getContext("2d")
      // ctx.beginPath();
      // ctx.strokeStyle = "white"
      // ctx.lineWidth = "6";
      // ctx.rect(0,0,150,150*this.height/this.width)
      // ctx.stroke()
    }
    if(this.running) {
      setTimeout(this.drawLoop, 1000 / 60);
    }
  }
  componentWillUnmount() {
    this.running = false;
  }
  render() {
    const passInfo = (poses) => {
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
        this.setState({
          pointsX: keyX,
          pointsY: keyY
        })
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
      this.setState({loaded:true})
    };
    return (

      <div>
        <PoseNet
          frameRate={10}
          className="PoseHandler-cam"
          onEstimate={passInfo}
        />
        <canvas ref="canvas2" className = "PoseHandler-visualizer" width={150} height={150*this.height/this.width} />
      </div>
    );
  }
}

// let video;
// let poseNet;
// let poses = [];

// function setup() {
//   createCanvas(640, 480);
//   video = createCapture(VIDEO);
//   video.size(width, height);

//   // Create a new poseNet method with a single detection
//   poseNet = ml5.poseNet(video, modelReady);
//   // This sets up an event that fills the global variable "poses"
//   // with an array every time new poses are detected
//   poseNet.on("pose", function (results) {
//     poses = results;

//     console.log(results);
//   });
//   // Hide the video element, and just show the canvas
//   video.hide();
// }

// function modelReady() {
//   select("#status").html("Model Loaded");
// }

// function draw() {
//   image(video, 0, 0, width, height);

//   // We can call both functions to draw all keypoints and the skeletons
//   drawKeypoints();
//   drawSkeleton();
// }

// // A function to draw ellipses over the detected keypoints
// function drawKeypoints() {
//   // Loop through all the poses detected
//   for (let i = 0; i < poses.length; i += 1) {
//     // For each pose detected, loop through all the keypoints
//     const pose = poses[i].pose;
//     for (let j = 0; j < pose.keypoints.length; j += 1) {
//       // A keypoint is an object describing a body part (like rightArm or leftShoulder)
//       const keypoint = pose.keypoints[j];
//       // Only draw an ellipse is the pose probability is bigger than 0.2
//       if (keypoint.score > 0.2) {
//         fill(255, 0, 0);
//         noStroke();
//         ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
//       }
//     }
//   }
// }

// // A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i += 1) {
//     const skeleton = poses[i].skeleton;
//     // For every skeleton, loop through all body connections
//     for (let j = 0; j < skeleton.length; j += 1) {
//       const partA = skeleton[j][0];
//       const partB = skeleton[j][1];
//       stroke(255, 0, 0);
//       line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
//     }
//   }
// }
export default PoseHandler;
