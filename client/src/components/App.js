import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Game from "./pages/Game.js";
import Join from "./pages/Join.js";
import Login from "./pages/Login.js";
import Lobby from "./pages/Lobby.js";
import NavBar from './modules/NavBar.js';

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <div className='App-container'>
          <NavBar/>
          <Router>
            {/* <Skeleton
              path="/"
              handleLogin={this.handleLogin}
              handleLogout={this.handleLogout}
              userId={this.state.userId}
            /> */}
            <Login path="/"/>
            <Join path="/join" setCode={this.setCode} setCodes={this.setCodes} codes={this.state.codes}/>
            <Lobby code={this.state.code} path="/:gamePin/lobby"/>
            <Game path="/:gamePin/game"/>

            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
