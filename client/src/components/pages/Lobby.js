import { navigate } from "@reach/router";
import React, { Component } from "react";
import cookie from "cookie";

import MapSelector from "../modules/MapSelector";
import ColorPicker from "./lobby/ColorPicker";
import NavBar from "../modules/NavBar.js";
import SettingsBar from "../modules/SettingsBar.js";

import "../../utilities.css";
import "./Lobby.css";
import { get, post } from "../../utilities.js";

import { socket } from "../../client-socket";
function myId() {
  return cookie.parse(document.cookie)["client-id"];
}

const COLORS = ['#FF00D0', '#FFFF00', '#00FF00', '#00D0FF', '#FFAA00', '#BB00FF', '#FED4FF', '#FFFFAB', '#C4FFC4', '#C2F4FF', '#FFE1A6', '#D1D1D1'];
const SIZE = ['small', 'medium', 'large'];
const RADIUS = [10, 12, 14];

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
      myName: this.props.location.state.name,
      myColor: undefined,
      display: 'LOBBY',
      browseMaps: false,

      standard: true,
      stdHeight: 25,
      stdWidth: 25,
      stdWallDensity: 25,
      stdMirrorDensity: 5,
      custWidth: 0,
      custHeight: 0,
      custBlocks: [],
      custMirrors: [],
      custTitle: undefined,

      duration: 5,
      cooldown: 2,
      respawn: 3,
      speed: 4,
      size: 1,

    };

    this.lobbyData = this.lobbyData.bind(this);
    this.startGame = this.startGame.bind(this);
    this.receiveStartGame = this.receiveStartGame.bind(this);
    this.getColor = this.getColor.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
    this.selectMap = this.selectMap.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
    socket.on("lobby-data", this.lobbyData);
    socket.on("start-game", (data) => this.receiveStartGame(data.startTime));

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

    let playerID = Object.keys(data.playerNames).find(key => data.playerNames[key] === this.state.myName);
    let colorKey = Object.keys(data.colors).find(key => data.colors[key] === playerID);
    this.setState({myColor: COLORS[colorKey]});
  }

  getColor(value) {
    let playerID = Object.keys(this.state.playerNames).find(key => this.state.playerNames[key] === value);
    let colorKey = Object.keys(this.state.colors).find(key => this.state.colors[key] === playerID);
    return COLORS[colorKey];
  }

  startGame() {
    if (this.state.creator) {
      console.log(this.state.custTitle === undefined || this.state.standard);
      socket.emit("start-game", {
        room: this.props.code,
        duration: this.state.duration,
        settings: {
          // map settings
          standard: this.state.standard || this.state.custTitle === undefined,
          mirrorDensity: this.state.stdMirrorDensity / 50,
          width: this.state.custWidth,
          height: this.state.custHeight,
          blocks: Array.from(this.state.custBlocks),
          mirrors: Array.from(this.state.custMirrors),

          // game settings
          speed: this.state.speed <= 4 ? this.state.speed / 4 : 2*(this.state.speed-4),
          size: RADIUS[this.state.size],
          respawn: this.state.respawn*5,
          cooldown: this.state.cooldown <= 4 ? this.state.cooldown / 4 : this.state.cooldown / 2 -1

        }
      });
      this.props.setDuration(this.state.duration);
    }
  }

  receiveStartGame(startTime) {
    navigate("/game", {state: {startTime: startTime, color: this.state.myColor}});
  }

  updateDisplay(display) {
    this.setState({display: display});
  }

  selectMap(title, width, height, blocks,mirrors) {
    this.setState({
      browseMaps: title.length === 0,
      custTitle: title,
      custWidth: width,
      custHeight: height,
      custBlocks: blocks,
      custMirrors: mirrors,
    })
  }

  render() {
    // makes the game code look prettier
    let code = "";
    for (let i = 0; i < this.props.code.length; i++) {
      code += this.props.code[i] + " ";
    }

    let grid = [];
    for(let i = 0; i < this.state.custHeight; i++) {
      let row = [];
      for(let j = 0; j < this.state.custWidth; j++) {
        let style = {};
        if(this.state.custBlocks.has(i+','+j)) {
          style = {backgroundColor: 'white'};
        } else if(this.state.custMirrors.has(i+','+j)) {
          style = {borderColor: 'white'};
        }
        row.push(<div className='Lobby-square' style={style}> </div>)
      }
      grid.push(<div className='Lobby-row'> {row} </div>);
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
              {this.state.creator ? <SettingsBar display={this.state.display} updateDisplay={this.updateDisplay}/> : <hr/> }


              {/* LOBBY / GENERAL VIEW SCREEN */}
              {(this.state.display === 'LOBBY' || !this.state.creator) &&
                <>
                  <div className="Lobby-people">
                    {this.state.players.map((value, index) => (
                      <div key={index} className="Lobby-username" style={{color: this.getColor(value)}}>
                        {value}
                      </div>
                    ))}

                  </div>
                  {this.state.creator ? (
                    <div>
                      <div style={{height: 16}}> </div>
                      <div className="u-button" onClick={this.startGame}>
                        {" "}
                        S T A R T{" "}
                      </div>
                    </div>

                  ) : <div className='Lobby-waiting'> waiting for host to start the game. . . </div>}
                </>
              }

              {(this.state.display === 'MAP') && (
                <>
                  <div className='Lobby-settingContainer'>
                    <div className='Lobby-settingHeading'> — Choose Your Map Type — </div>
                    <div className='Lobby-mapTypes'>
                      <div className='Lobby-mapType' onClick={(e) => {this.setState({standard: true})}} style={this.state.standard ? {backgroundColor: '#363636'} : {backgroundColor: 'black'}}> Standard Map </div>
                      <div className='Lobby-mapType' onClick={(e) => {this.setState({standard: false})}} style={!this.state.standard ? {backgroundColor: '#363636'} : {backgroundColor: 'black'}}> Custom Map </div>
                    </div>
                    {
                      this.state.standard ?
                        (
                          <div className='Lobby-mapSettings'>
                            {/* <div className='Lobby-settingTitle'> Map Width: {this.state.stdWidth / 50} </div>
                            <input className='Lobby-slider' type='range' min='1' max='50' value={this.state.stdWidth} onChange={(e) => this.setState({stdWidth: e.target.value})}></input>
                            <div className='Lobby-settingTitle'> Map Height: {this.state.stdHeight / 50} </div>
                            <input className='Lobby-slider' type='range' min='1' max='50' value={this.state.stdHeight} onChange={(e) => this.setState({stdHeight: e.target.value})}></input>
                            <div className='Lobby-settingTitle'> Wall Density: {this.state.stdWallDensity / 50} </div>
                            <input className='Lobby-slider' type='range' min='1' max='50' value={this.state.stdWallDensity} onChange={(e) => this.setState({stdWallDensity: e.target.value})}></input> */}
                            <div className='Lobby-settingTitle'> Mirror Density: {this.state.stdMirrorDensity / 50} </div>
                            <input className='Lobby-slider' type='range' min='0' max='50' value={this.state.stdMirrorDensity} onChange={(e) => this.setState({stdMirrorDensity: e.target.value})}></input>
                          </div>
                        ) :
                        <div classname='Lobby-mapSettings'>
                          <div className='Lobby-settingTitle'> Your Selected Custom Map: {this.state.custTitle === undefined ? 'NOT SELECTED YET' : this.state.custTitle} </div>
                          <div className='Lobby-gridContainer'>
                            {grid}
                          </div>
                          <div className='u-spacer'> </div>
                          <div className='Lobby-mapType u-button2' style={{width: '50%', margin: '0 auto'}} onClick={(e) => this.setState({browseMaps: true})}>
                            { this.state.custTitle === undefined ? 'Browse Maps' : 'Change Map' }
                          </div>


                        </div>
                    }


                  </div>

                </>
              )}



              {/* GAME SETTINGS SCREEN */}
              {
                this.state.display === 'GAME' && (
                  <div className='Lobby-settingContainer' style={{width: 404, paddingBottom: 32}}>
                    <div className='Lobby-settingHeading'> — Gameplay Settings — </div>
                    <div className='Lobby-settingTitle'> Game Duration: {this.state.duration} min </div>
                    <input className='Lobby-slider' type='range' min='1' max='15' value={this.state.duration} onChange={(e) => {this.setState({duration: e.target.value})}}></input>
                    <div className='Lobby-settingTitle'> Kill Cooldown: {this.state.cooldown <= 4 ? this.state.cooldown / 4 : this.state.cooldown / 2 -1} sec </div>
                    <input className='Lobby-slider' type='range' min='1' max='12' value={this.state.cooldown} onChange={(e) => {this.setState({cooldown: e.target.value})}}></input>
                    <div className='Lobby-settingTitle'> Respawn Time: {this.state.respawn*5} sec </div>
                    <input className='Lobby-slider' type='range'  min='1' max='12' value={this.state.respawn} onChange={(e) => {this.setState({respawn: e.target.value})}}></input>
                    <div className='Lobby-settingTitle'> Player Size: {SIZE[this.state.size]} </div>
                    <input className='Lobby-slider' type='range' min='0' max='2' value={this.state.size} onChange={(e) => {this.setState({size: e.target.value})}}></input>
                    <div className='Lobby-settingTitle'> Player Speed: {this.state.speed <= 4 ? this.state.speed / 4 : 2*(this.state.speed-4)}x </div>
                    <input className='Lobby-slider' type='range' min='1' max='6' value={this.state.speed} onChange={(e) => {this.setState({speed: e.target.value})}}></input>
                  </div>
                )
              }
            </div>

            {this.state.browseMaps ?
              <MapSelector userId={this.props.userId} selectMap={this.selectMap}/> :

              <ColorPicker
                code={this.props.code}
                colorMap={this.state.colors}
                names={this.state.playerNames}
              ></ColorPicker>
            }


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
