import { navigate } from "@reach/router";
import React, { Component } from "react";
import cookie from "cookie";

import ColorPicker from "./lobby/ColorPicker";
import NavBar from "../modules/NavBar.js";

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
    this.startGame = this.startGame.bind(this);
    this.receiveStartGame = this.receiveStartGame.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!

    socket.on("lobby-data", this.lobbyData);
    socket.on("start-game", this.receiveStartGame);

    if (this.props.code == "" || this.props.code === undefined) {
      post("/api/curRoom").then((data) => {
        const { room } = data;

        if (room === undefined) {
          navigate("/join");
        } else {
          this.props.changeRoom(room);
        }
      });

      return;
    }

    const checkAgain = () => {
      if (!this.state.initialized) {
        socket.emit("join-room", {
          room: this.props.code,
        });

        setTimeout(checkAgain, 1000);
      }
    };

    checkAgain();
  }

  componentWillUnmount() {
    socket.off("lobby-data", this.lobbyData);
    socket.off("start-game", this.receiveStartGame);
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

  startGame() {
    if (this.state.creator) {
      socket.emit("start-game", {
        room: this.props.code,
      });
    }
  }

  receiveStartGame() {
    navigate("/game");
  }

  render() {
    // makes the game code look prettier
    let code = "";
    for (let i = 0; i < this.props.code.length; i++) {
      code += this.props.code[i] + " ";
    }

    if (this.state.initialized) {
      return (
        <>
          <NavBar />
          <div className="Lobby-container">
            <div className='Lobby-contents'>
              <div className="Lobby-header">
                <div className="Lobby-heading"> Game Code </div>
                <div className="Lobby-code"> {code} </div>
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

              {this.state.creator && (
                <div className="u-button" onClick={this.startGame}>
                  {" "}
                  S T A R T{" "}
                </div>
              )}
            </div>
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
          <NavBar />
          <div className="Lobby-container">
            <div className="Lobby-load Lobby-heading u-textCenter"> L O A D I N G . . .</div>
            <div className="Lobby-loading"> </div>
          </div>
        </>
      );
    }
  }
}

export default Lobby;
