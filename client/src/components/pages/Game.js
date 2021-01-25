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
      games: 0,
      kills: 0,
      deaths: 0,
      wins: 0,
      variableToTriggerRefresh: 0,
      poseEnabled: this.props.poseEnabled
    };

    this.updateLeaderboard = this.updateLeaderboard.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  updateLeaderboard(leaderboardInfo) {
    this.setState({ leaderboardInfo: leaderboardInfo });
  }

  endGame() {
    setTimeout(() => {
      navigate("/leaderboard", { state: { leaderboardInfo: this.state.leaderboardInfo } });
    }, 5 * 1000);

    // let standings = this.state.leaderboardInfo.sort((a, b) => (a.points > b.points) ? -1 : 1);
    // for(let i = 0; i < standings.length; i++) {
    //   if(standings[i].color === this.state.color) {
    //     post('/api/stats', {
    //       userId: this.props.userId,
    //       games: this.state.games + 1,
    //       wins: i === 0 ? this.state.wins + 1 : this.state.wins,
    //       points: this.state.kills + standings[i].points,
    //       deaths: this.state.deaths + standings[i].deaths,
    //     });
    //     break;
    //   }
    // }
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.setState({poseEnabled: this.props.poseEnabled})
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

    // get('/api/stats', {userId: this.props.userId}).then((data) => {
    //   this.setState({
    //     games: data.games,
    //     kills: data.points,
    //     deaths: data.deaths,
    //     wins: data.wins
    //   });
    // });
  }

  render() {
    return (
      <>
        <div className="Game-sidebar">
          <Timer
            startTime={this.state.startTime}
            duration={this.props.duration}
            endGame={this.endGame}
          />
          <div style={{height: 16}}> </div>
          <LiveLeaderboard leaderboardInfo={this.state.leaderboardInfo} color={this.state.color} />
          <div style={{height: 16}}> </div>
          <div className='u-textCenter'> — LEGEND — </div>
          <div className='Game-legend'>
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
                >
                </div>
              </span>
              walls stop lasers
          </div>
          <div className='Game-legend'>
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
              >
              </div>
            </span>
            mirrors reflect lasers
          </div>
          <div className='Game-legend'>
              shrink = red potion
          </div>
          <div className='Game-legend'>
              invisibility = black cloak
          </div>
          <div className='Game-legend'>
              super speed = lightning
          </div>


        </div>
        <Canvas
          code={this.props.code}
          color={this.state.color}
          updatePoints={this.updatePoints}
          updateLeaderboard={this.updateLeaderboard}
          className="Game-canvas"
        />
        {this.state.poseEnabled && <PoseHandler code={this.props.code} />}
      </>
    );
  }
}

export default Game;
