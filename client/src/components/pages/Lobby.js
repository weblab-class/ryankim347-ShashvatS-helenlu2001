import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import "./Lobby.css";
/**
 * @param userId specifies the id of the currently logged in user
 */

class Lobby extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      creator: true,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <div className="Lobby-container">
          <div className="Lobby-header">
            <div className="Lobby-heading"> Game Code </div>
            <div className="Lobby-code">
              {" "}
              {window.location.pathname.substring(window.location.pathname.length - 6)}{" "}
            </div>
          </div>
          <hr />

          <div className="Lobby-people">
            <div className="Lobby-username"> helu </div>
            <div className="Lobby-username"> helu </div>
            <div className="Lobby-username"> helu </div>
            <div className="Lobby-username"> helu </div>
            <div className="Lobby-username"> helu </div>
            <div className="Lobby-username"> helu </div>
          </div>
        </div>
      </>
    );
  }
}

export default Lobby;
