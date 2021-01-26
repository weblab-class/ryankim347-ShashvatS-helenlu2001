import React, { Component } from "react";
import "../../utilities.css";
import "./SettingsBar.css";
/**
 * @param userId specifies the id of the currently logged in user
 */

class SettingsBar extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};

    this.clickLobby = this.clickLobby.bind(this);
    this.clickMap = this.clickMap.bind(this);
    this.clickGame = this.clickGame.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  clickLobby(e) {
    this.props.updateDisplay("LOBBY");
  }

  clickMap(e) {
    this.props.updateDisplay("MAP");
  }

  clickGame(e) {
    this.props.updateDisplay("GAME");
  }

  render() {
    return (
      <>
        <div className="SettingsBar-container">
          <div
            className="SettingsBar-entry"
            onClick={this.clickLobby}
            style={
              this.props.display === "LOBBY"
                ? { backgroundColor: "#363636" }
                : { backgroundColor: "black" }
            }
          >
            LOBBY
          </div>
          <div
            className="SettingsBar-entry"
            onClick={this.clickMap}
            style={
              this.props.display === "MAP"
                ? { backgroundColor: "#363636" }
                : { backgroundColor: "black" }
            }
          >
            MAP
          </div>
          <div
            className="SettingsBar-entry"
            onClick={this.clickGame}
            style={
              this.props.display === "GAME"
                ? { backgroundColor: "#363636" }
                : { backgroundColor: "black" }
            }
          >
            GAME
          </div>
        </div>
      </>
    );
  }
}

export default SettingsBar;
