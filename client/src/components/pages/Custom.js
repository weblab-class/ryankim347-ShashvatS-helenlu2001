import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Custom.css";
import { post } from "../../utilities";

class Custom extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      name: "",
      width: 25,
      height: 25,
      description:
        "walls block bullets; click a non-wall tile to place a wall, click again to remove",
      creatorName: "",
      down: false,

      saved: false,
      public: false,
      mode: "WALL",
    };

    this.changeWidth = this.changeWidth.bind(this);
    this.changeHeight = this.changeHeight.bind(this);

    this.clickTile = this.clickTile.bind(this);

    this.saveMap = this.saveMap.bind(this);
    this.publicMap = this.publicMap.bind(this);
    this.clearMap = this.clearMap.bind(this);
    this.enterTile = this.enterTile.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  changeWidth(e) {
    this.setState({ saved: false });
    this.setState({ width: e.target.value });
  }

  changeHeight(e) {
    this.setState({ saved: false });
    this.setState({ height: e.target.value });
  }

  publicMap() {
    this.setState({ saved: false });
    this.setState({ public: !this.state.public });
  }

  clickTile(e) {
    this.setState({ saved: false });
    if (this.state.mode === "WALL") {
      e.target.style.borderColor = "rgb(56, 56, 56)";
      if (e.target.style.backgroundColor === "white") {
        e.target.style.backgroundColor = "black";
      } else {
        e.target.style.backgroundColor = "white";
      }
    } else if (this.state.mode === "MIRROR") {
      e.target.style.backgroundColor = "black";
      if (e.target.style.borderColor === "white") {
        e.target.style.borderColor = "rgb(56, 56, 56)";
      } else {
        e.target.style.borderColor = "white";
      }
    }
  }

  saveMap() {
    let x = [];
    let y = [];
    let mx = [];
    let my = [];

    for (let i = 0; i < this.state.height; i++) {
      for (let j = 0; j < this.state.width; j++) {
        let square = document.getElementById(i + "," + j);
        if (square.style.backgroundColor === "white") {
          x.push(i);
          y.push(j);
        }
        if (square.style.borderColor === "white") {
          mx.push(i);
          my.push(j);
        }
      }
    }

    let req = {
      creatorID: this.props.userId,
      creatorName: this.state.creatorName.length === 0 ? "Anonymous" : this.state.creatorName,
      name: this.state.name,
      width: this.state.width,
      height: this.state.height,
      x: x,
      y: y,
      mx: mx,
      my: my,
      public: this.state.public,
    };

    post("/api/addMap", req).then(() => {
      console.log("success!");
    });

    this.clearMap();

    this.setState({ saved: true, name: "" });
  }

  clearMap() {
    for (let i = 0; i < this.state.height; i++) {
      for (let j = 0; j < this.state.width; j++) {
        let square = document.getElementById(i + "," + j);
        square.style.backgroundColor = "black";
        square.style.borderColor = "rgb(56, 56, 56)";
      }
    }
  }

  enterTile(e) {
    if (this.state.down) {
      this.clickTile(e);
    }
  }

  render() {
    let grid = [];
    for (let i = 0; i < this.state.height; i++) {
      let row = [];
      for (let j = 0; j < this.state.width; j++) {
        row.push(
          <div
            className="Custom-square"
            id={i + "," + j}
            onMouseDown={() => this.setState({ down: true })}
            onMouseUp={() => {
              this.setState({ down: false });
            }}
            onMouseEnter={this.enterTile}
            onClick={this.clickTile}
          >
            {" "}
          </div>
        );
      }
      grid.push(<div className="Custom-row"> {row} </div>);
    }

    return (
      <>
        <NavBar />
        <div className="Custom-container">
          <div className="Custom-mapContainer">
            {grid}
            <div className="Custom-note"> each grid cell represents a 40px by 40px square </div>
            <div className="u-button" onClick={this.clearMap}>
              {" "}
              C L E A R{" "}
            </div>
          </div>
          <div className="Custom-settingsContainer">
            <div className="u-heading u-textCenter" style={{ marginBottom: 16 }}>
              {" "}
              — SETTINGS —{" "}
            </div>
            <div> Created By: </div>
            <input
              className="Custom-name"
              value={this.state.creatorName}
              onChange={(e) => this.setState({ creatorName: e.target.value })}
            />
            <div> Map Name: </div>
            <input
              className="Custom-name"
              value={this.state.name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <div> Map Width: {this.state.width} </div>
            <input
              type="range"
              id="width"
              name="width"
              min="1"
              max="50"
              value={this.state.width}
              onChange={this.changeWidth}
            ></input>
            <div> Map Height: {this.state.height} </div>
            <input
              type="range"
              id="height"
              name="height"
              min="1"
              max="50"
              value={this.state.height}
              onChange={this.changeHeight}
            ></input>
            <div> Add Map Elements </div>
            <div className="Custom-elements">
              <div
                className="Custom-wall"
                onClick={() => {
                  this.setState({
                    description:
                      "walls block bullets; click a non-wall tile to place a wall, click again to remove",
                    mode: "WALL",
                  });
                }}
              >
                {" "}
              </div>
              <div
                className="Custom-mirror"
                onClick={() => {
                  this.setState({
                    description:
                      "mirrors reflect bullets; click a non-mirror tile to place a mirror, click again to remove",
                    mode: "MIRROR",
                  });
                }}
              >
                {" "}
              </div>
            </div>
            <div className="Custom-elementDescrip"> {this.state.description} </div>
            <div style={{ display: "flex", marginBottom: 32 }}>
              <div style={{ marginRight: 16 }}> Make Map Available to Public? </div>
              <input style={{ width: 20, margin: 0 }} type="checkbox" onClick={this.publicMap} />
            </div>

            <div className="u-button" onClick={this.saveMap}>
              {" "}
              S A V E{" "}
            </div>
            {this.state.saved && <div className="Custom-status"> map is saved! </div>}
          </div>
        </div>
      </>
    );
  }
}

export default Custom;
