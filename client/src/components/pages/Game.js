import React, { Component } from "react";
import Timer from '../modules/Timer.js';
import Leaderboard from '../modules/Leaderboard.js';
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
      color: this.props.location.state.color,
      leaderboardInfo: [],
    };
    this.updateLeaderboard = this.updateLeaderboard.bind(this);
  }


  updateLeaderboard(leaderboardInfo) {
    this.setState({leaderboardInfo: leaderboardInfo});
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
        <div className='Game-sidebar'>
          <Timer startTime={this.state.startTime}/>
          <Leaderboard leaderboardInfo={this.state.leaderboardInfo} color={this.state.color}/>
        </div>
        <div className="Game-container">
          <div>game board </div>
          <Canvas code={this.props.code} color={this.state.color} updatePoints={this.updatePoints} updateLeaderboard={this.updateLeaderboard} className="Game-canvas" />
        </div>


      </>
    );
  }
}

export default Game;
