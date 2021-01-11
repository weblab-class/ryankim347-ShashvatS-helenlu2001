import { navigate } from "@reach/router";
import React, { Component } from "react";
import cookie from "cookie";
const EventEmitter = require("events");

import { currentRoom } from "../../global";
import "../../utilities.css";
import "./Lobby.css";

import { socket } from "../../client-socket";

const eventEmitter = new EventEmitter();

socket.on("lobby-data", (data) => {
  eventEmitter.emit("lobby-data", data);
});

function joinRoom() {
  console.log("trying to join here");
  socket.emit("join-room", {
    room: calculateRoom(),
  });
  console.log("should have emitted something");
}

function calculateRoom() {
  return currentRoom.room;
}

function myId() {
  return cookie.parse(document.cookie)["client-id"];
}

/**
 * @param userId specifies the id of the currently logged in user
 */

class Lobby extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State

    this.state = {
      initialized: false,
      creator: false,
      players: [],
    };

    this.lobbyData = this.lobbyData.bind(this);

    this.onStart = this.onStart.bind(this);

    console.log(calculateRoom());
  }

  componentDidMount() {
    // remember -- api calls go here!

    console.log("trying to join room...");

    console.log(socket);

    // socket.on("lobby-data", (data) => this.lobbyData(data));

    eventEmitter.on("lobby-data", (data) => {
      this.lobbyData(data);
    });

    joinRoom();
  }

  componentWillUnmount() {
    // socket.off("lobby-data");
  }

  lobbyData(data) {
    const host = data.host_id;
    const amHost = host === myId();

    const players = [];

    for (let i = 0; i < data.players.length; ++i) {
      players.push(data.playerNames[data.players[i]]);
    }

    this.setState({
      initialized: true,
      creator: amHost,
      players: players,
    });
  }

  onStart() {
    navigate("/lobby2");
  }

  render() {
    if (this.state.initialized) {
      return (
        <>
          <div className="Lobby-container">
            <div className="Lobby-header">
              <div className="Lobby-heading"> Game Code </div>
              <div className="Lobby-code"> {calculateRoom()} </div>
            </div>
            <hr />

            <div className="Lobby-people">
              {this.state.players.map((value, index) => (
                <div key={index} className="Lobby-username">
                  {value}
                </div>
              ))}
            </div>

            <button onClick={this.onStart}>Dummy start button</button>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>Loading the lobby...</div>
          <button onClick={this.onStart}>Dummy start button</button>
        </>
      );
    }
  }
}

export default Lobby;
