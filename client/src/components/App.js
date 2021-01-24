import React, { Component } from "react";
import { navigate, Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Game from "./pages/Game.js";
import Join from "./pages/Join.js";
import Login from "./pages/Login.js";
import Lobby from "./pages/Lobby.js";
import Stats from "./pages/Stats.js";
import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import Leaderboard from "./pages/Leaderboard.js";
import Custom from "./pages/Custom.js";
/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      name: "",
      img: "",
      code: "",
      username: '',
      gameDuration: 5,
    };

    this.changeRoom = this.changeRoom.bind(this);
    this.setDuration = this.setDuration.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({
          userId: user._id,
          name: user.name,
          img: user.photo,
        });
      }
    });

    socket.on("connect", () => {
      if (this.state.code !== "") {
        socket.emit("join-room", {
          room: this.state.code,
        });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      console.log(res.profileObj);
      this.setState({
        userId: user._id,
        name: res.profileObj.name,
        img: res.profileObj.imageUrl,
      });
    });
    navigate("/join");
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
    navigate("/");
  };

  changeRoom(room) {
    if (room !== "") {
      socket.emit("join-room", {
        room,
      });
    }

    this.setState({
      code: room,
    });
  }

  setDuration(duration) {
    this.setState({ gameDuration: duration });
  }

  setUsername(username) {
    this.setState(
      {username: username}
    );
  }

  render() {
    return (
      <>
        <div className="App-container">
          <Router>
            <Skeleton
              path="/skeleton"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />
            <Login
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            />

            <Join
              path="/join"
              changeRoom={this.changeRoom}
              setUsername={this.setUsername}
            />

            <Lobby
              code={this.state.code}
              changeRoom={this.changeRoom}
              userId={this.state.userId}
              setDuration={this.setDuration}
              username={this.state.username}
              path="/lobby"
            />
            <Game
              code={this.state.code}
              changeRoom={this.changeRoom}
              userId={this.state.userId}
              duration={this.state.gameDuration}
              path="/game"
            />
            <Leaderboard path="/leaderboard" />
            <Custom path="/customize" userId={this.state.userId} name={this.state.name} />

            <Stats
              path="/stats"
              name={this.state.name}
              img={this.state.img}
              userId={this.state.userId}
              handleLogout={this.handleLogout}
            />

            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
