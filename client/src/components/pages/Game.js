import React, { Component } from "react";

import Canvas from "../modules/Canvas.js";
import "../../utilities.css";
import "./Game.css";
import { get, post } from "../../utilities.js";
import { navigate } from "@reach/router";

/**
 * @param userId specifies the id of the currently logged in user
 */

class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!

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
  }

  render() {
    return (
      <>
        <div className="Game-container">
          <div>game board </div>
          <Canvas code={this.props.code} className="Game-canvas" />
        </div>
      </>
    );
  }
}

export default Game;
