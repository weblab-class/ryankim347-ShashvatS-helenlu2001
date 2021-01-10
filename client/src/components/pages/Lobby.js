import { navigate } from "@reach/router";
import React, { Component } from "react";
import { currentRoom } from "../../global";
import "../../utilities.css";
import "./Lobby.css";

import { socket } from "../../client-socket";

function calculateRoom() {
  return window.location.pathname.substring(window.location.pathname.length - 6);
}

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

    const room = calculateRoom();
    currentRoom.room = room;

    this.lobbyData = this.lobbyData.bind(this);

    socket.on("new-lobby-data", (data) => this.lobbyData(data));
  }

  componentDidMount() {
    // remember -- api calls go here!
    socket.emit("fetch-lobby-data", {});
  }

  lobbyData() {}

  render() {
    return (
      <>
        <div className="Lobby-container">
          <div className="Lobby-header">
            <div className="Lobby-heading"> Game Code </div>
            <div className="Lobby-code"> {calculateRoom()} </div>
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
