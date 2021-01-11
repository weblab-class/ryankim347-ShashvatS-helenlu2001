import { navigate } from "@reach/router";
import React, { Component } from "react";
import cookie from "cookie";

import ColorPicker from "./lobby/ColorPicker";

import "../../utilities.css";
import "./Lobby.css";
import { get, post } from "../../utilities.js";

import { socket } from "../../client-socket";
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
      colors: undefined,
      playerNames: undefined,
    };

    this.lobbyData = this.lobbyData.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!

    socket.on("lobby-data", this.lobbyData);

    console.log(this.props.code);
    console.log("here");
    console.log(typeof this.props.code);
    console.log(this.props.code.length);

    if (this.props.code == "" || this.props.code === undefined) {
      post("/api/curRoom").then((data) => {
        const { room } = data;

        if (room === undefined) {
          navigate("/join");
        } else {
          console.log("I am over here");
          this.props.changeRoom(room);
        }
      });

      return;
    }

    socket.emit("join-room", {
      room: this.props.code,
    });
  }

  componentWillUnmount() {
    socket.off("lobby-data", this.lobbyData);
  }

  componentDidUpdate(prevProps) {
    if (this.props.code !== prevProps.code) {
      socket.emit("join-room", {
        room: this.props.code,
      });
    }
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
      playerNames: data.playerNames,
      colors: data.colors,
    });
  }

  // TODO: the loading page currently should almost never show up, but it still looks ugly

  render() {
    if (this.state.initialized) {
      return (
        <>
          <div className="Lobby-container">
            <div className="Lobby-header">
              <div className="Lobby-heading"> Game Code </div>
              <div className="Lobby-code"> {this.props.code} </div>
            </div>
            <hr />

            {/* TODO: change the player name color based on the results of the colors (this.state.colors) */}

            <div className="Lobby-people">
              {this.state.players.map((value, index) => (
                <div key={index} className="Lobby-username">
                  {value}
                </div>
              ))}
            </div>

            {/* TODO: make this look nice */}
            <ColorPicker
              code={this.props.code}
              colorMap={this.state.colors}
              names={this.state.playerNames}
            ></ColorPicker>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>Loading the lobby...</div>
        </>
      );
    }
  }
}

export default Lobby;
