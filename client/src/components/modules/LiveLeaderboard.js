import React, { Component } from "react";
import "../../utilities.css";
import "./LiveLeaderboard.css";

class LiveLeaderboard extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    this.props.leaderboardInfo.sort((a, b) => (a.points > b.points ? -1 : 1));
    return (
      <>
        <div className="LiveLeaderboard-container">
          <div className="LiveLeaderboard-title"> — LEADERBOARD — </div>
          {this.props.leaderboardInfo.map((e) => {
            return (
              <div
                className="LiveLeaderboard-entry"
                style={e.color === this.props.color ? { border: "1px solid white" } : {}}
                key={e.name}
              >
                <div className="LiveLeaderboard-name" style={{ color: e.color }}>
                  {" "}
                  {e.name}{" "}
                </div>
                <div> {e.points} </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default LiveLeaderboard;
