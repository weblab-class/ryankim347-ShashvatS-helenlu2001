import React, { Component } from "react";
import Timer from "../modules/Timer.js";
import LiveLeaderboard from "../modules/LiveLeaderboard.js";
import Canvas from "../modules/Canvas.js";
import PoseHandler from "../modules/PoseHandler.js";
import "../../utilities.css";
import "./Game.css";
import { get, post } from "../../utilities.js";
import { navigate } from "@reach/router";

import { socket } from "../../client-socket";

const COLORS = [
  "#FF00D0",
  "#FFFF00",
  "#00FF00",
  "#00D0FF",
  "#FFAA00",
  "#BB00FF",
  "#FED4FF",
  "#FFFFAB",
  "#C4FFC4",
  "#C2F4FF",
  "#FFE1A6",
  "#D1D1D1",
];

/**
 * @param userId specifies the id of the currently logged in user
 */

class Game extends Component {
  constructor(props) {
    super(props);

    // Initialize Default State
    this.state = {
      startTime: undefined,
      color: undefined,
      leaderboardInfo: [],
      gameOver: false,
      games: 0,
      kills: 0,
      deaths: 0,
      wins: 0,
      variableToTriggerRefresh: 0,
      poseEnabled: undefined,
    };

    this.updateLeaderboard = this.updateLeaderboard.bind(this);
    this.endGame = this.endGame.bind(this);
    this.startGameInfo = this.startGameInfo.bind(this);

    socket.on("start-game-information", this.startGameInfo);
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
    } else {
      socket.emit("start-game-information", {
        room: this.props.code,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.code !== prevProps.code) {
      socket.emit("join-room", {
        room: this.props.code,
      });

      socket.emit("start-game-information", {
        room: this.props.code,
      });
    }
  }

  startGameInfo(data) {
    console.log("received some stuff...");

    this.setState({
      startTime: data.startTime,
      poseEnabled: data.poseEnabled,
      color: COLORS[data.color],
      duration: data.duration,
    });
  }

  render() {
    return (
      <>
        <div className="Game-sidebar">
          <Timer
            startTime={this.state.startTime}
            duration={this.state.duration}
            endGame={this.endGame}
          />
          <div style={{ height: 16 }}> </div>
          <LiveLeaderboard leaderboardInfo={this.state.leaderboardInfo} color={this.state.color} />
          <div style={{ height: 16 }}> </div>
          <div className="u-textCenter"> — LEGEND — </div>
          <div className="Game-legend">
            <span>
              <div
                style={{
                  border: "1px solid white",
                  backgroundColor: "white",
                  width: 8,
                  height: 8,
                  marginBottom: 0,
                  marginRight: 8,
                  display: "inline-block",
                }}
              ></div>
            </span>
            walls stop lasers
          </div>
          <div className="Game-legend">
            <span>
              <div
                style={{
                  border: "1px solid white",
                  width: 8,
                  height: 8,
                  marginBottom: 0,
                  marginRight: 8,
                  display: "inline-block",
                }}
              ></div>
            </span>
            mirrors reflect lasers
          </div>
          <div className="Game-legend">shrink = red potion</div>
          <div className="Game-legend">invisibility = black cloak</div>
          <div className="Game-legend">super speed = lightning</div>
        </div>
        <Canvas
          code={this.props.code}
          color={this.state.color}
          updatePoints={this.updatePoints}
          updateLeaderboard={this.updateLeaderboard}
          className="Game-canvas"
          poseEnabled={this.state.poseEnabled}
        />
        {this.state.poseEnabled && <PoseHandler code={this.props.code} />}
      </>
    );
  }
}

export default Game;
