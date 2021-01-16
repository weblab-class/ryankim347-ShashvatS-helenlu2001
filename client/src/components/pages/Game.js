import React, { Component } from "react";
import Timer from '../modules/Timer.js';
import Canvas from "../modules/Canvas.js";
import "../../utilities.css";
import "./Game.css";
import { get, post } from "../../utilities.js";
import { navigate } from "@reach/router";
import { Route } from "react-router-dom";

/**
 * @param userId specifies the id of the currently logged in user
 */

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      startTime: this.props.location.state.startTime,
      color: this.props.location.state.color
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    console.log(this.state.color);
    if (this.props.code == "" || this.props.code === undefined) {
      post("/api/curRoom").then((data) => {
        const { room } = data;

        if (room === undefined || room === "") {
          navigate("/join");
        } else {
          console.log(room);
          this.props.changeRoom(room);
        }
      });

      return;
    }

    console.log('state start time' + this.state.startTime);
    console.log('now' + Date.now());
    console.log(this.state.startTime + 5000 - Date.now());

  }

  render() {
    return (
      <>
        <Timer startTime={this.state.startTime}/>
        <div className="Game-container">
          <div>game board </div>
          <Canvas code={this.props.code} color={this.state.color} className="Game-canvas" />
        </div>
      </>
    );
  }
}

export default Game;
