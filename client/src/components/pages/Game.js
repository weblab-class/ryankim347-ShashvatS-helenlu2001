import React, { Component } from "react";
import Timer from "../modules/Timer.js";
import LiveLeaderboard from "../modules/LiveLeaderboard.js";
import Canvas from "../modules/Canvas.js";
import PoseHandler from "../modules/PoseHandler.js";
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
      gameOver: false,
      variableToTriggerRefresh: 0,
    };

    this.updateLeaderboard = this.updateLeaderboard.bind(this);
    this.endGame = this.endGame.bind(this);
    this.triggerRefresh = this.triggerRefresh.bind(this);
  }

  updateLeaderboard(leaderboardInfo) {
    this.setState({ leaderboardInfo: leaderboardInfo });
  }

  endGame() {
    setTimeout(() => {
      navigate("/leaderboard", { state: { leaderboardInfo: this.state.leaderboardInfo } });
    }, 5 * 1000);
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

  triggerRefresh() {
    this.setState({
      variableToTriggerRefresh: this.state.variableToTriggerRefresh + 1,
    });
  }

  render() {
    return (
      <>
        <div className="Game-sidebar">
          <Timer startTime={this.state.startTime} endGame={this.endGame} />
          <LiveLeaderboard leaderboardInfo={this.state.leaderboardInfo} color={this.state.color} />
        </div>
        <Canvas
          code={this.props.code}
          color={this.state.color}
          updatePoints={this.updatePoints}
          updateLeaderboard={this.updateLeaderboard}
          triggerRefresh={this.triggerRefresh}
          variableToTriggerRefresh={this.state.variableToTriggerRefresh}
          className="Game-canvas"
        />
        <PoseHandler code={this.props.code} />
      </>
    );
  }
}

export default Game;
