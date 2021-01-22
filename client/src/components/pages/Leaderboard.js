import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./Leaderboard.css";
/**
 * @param userId specifies the id of the currently logged in user
 */

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      leaderboardInfo: [],
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    this.setState({
      leaderboardInfo: this.props.location.state.leaderboardInfo.sort((a, b) =>
        a.points > b.points ? -1 : 1
      ),
    });
  }

  render() {
    let rest = [];
    for (let i = 3; i < this.state.leaderboardInfo.length; i++) {
      rest.push(
        <div className="Leaderboard-restrow">
          <div className="Leaderboard-restplace"> {i + 1} </div>
          <div
            className="Leaderboard-restname"
            style={{ color: this.state.leaderboardInfo[i].color }}
          >
            {" "}
            {this.state.leaderboardInfo[i].name}{" "}
          </div>
          <div className="Leaderboard-restpoints"> {this.state.leaderboardInfo[i].points} pts </div>
        </div>
      );
    }

    return (
      <>
        <NavBar />
        <div className="Leaderboard-container">
          <div className="Leaderboard-title"> L E A D E R B O A R D </div>
          <div className="Leaderboard-top3container">
            <div className="Leaderboard-place">
              <div className="Leaderboard-name">
                {" "}
                {this.state.leaderboardInfo[1]
                  ? this.state.leaderboardInfo[1].name.toUpperCase()
                  : ""}{" "}
              </div>
              <div className="Leaderboard-second Leaderboard-top3"> 2ND </div>
            </div>
            <div className="Leaderboard-place">
              <div className="Leaderboard-name">
                {" "}
                {this.state.leaderboardInfo[0]
                  ? this.state.leaderboardInfo[0].name.toUpperCase()
                  : ""}{" "}
              </div>
              <div className="Leaderboard-first Leaderboard-top3"> 1ST </div>
            </div>
            <div className="Leaderboard-place">
              <div className="Leaderboard-name">
                {" "}
                {this.state.leaderboardInfo[2]
                  ? this.state.leaderboardInfo[2].name.toUpperCase()
                  : ""}{" "}
              </div>
              <div className="Leaderboard-third Leaderboard-top3"> 3RD </div>
            </div>
          </div>
          <hr style={{ marginTop: 32 }} />
          <div className="Leaderboard-rest"></div>
        </div>
        <div className="Leaderboard-button-container">
          <div
            className="Leaderboard-button"
            onClick={() => {
              navigate("/lobby");
            }}
          >
            {" "}
            A G A I N{" "}
          </div>
          <div className="Leaderboard-spacer"> </div>
          <div
            className="Leaderboard-button"
            onClick={() => {
              navigate("/join");
            }}
          >
            {" "}
            E X I T{" "}
          </div>
        </div>
      </>
    );
  }
}

export default Leaderboard;
