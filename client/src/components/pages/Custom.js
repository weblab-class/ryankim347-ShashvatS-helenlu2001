import { Link, navigate } from "@reach/router";
import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Custom.css";
/**
 * @param userId specifies the id of the currently logged in user
 */


class Custom extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      width: 25,
      height: 25,
      description: '',

      elements: {
        walls: new Set()
      }
    };

    this.changeWidth = this.changeWidth.bind(this);
    this.changeHeight = this.changeHeight.bind(this);

    this.clickTile = this.clickTile.bind(this);

    this.wallDescrip = this.wallDescrip.bind(this);

  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  changeWidth(e) {
    this.setState({width: e.target.value});
  }

  changeHeight(e) {
    this.setState({height: e.target.value});
  }

  wallDescrip(e) {
    this.setState({description: 'click an empty tile to place a wall, click again to remove'});

  }

  clickTile(e) {
    if(e.target.style.backgroundColor === 'white') {
      e.target.style.backgroundColor = 'black';
      this.state.elements.walls.delete(e.target.id);
    } else {
      e.target.style.backgroundColor = 'white';
      this.state.elements.walls.add(e.target.id);
    }
  }


  render() {
    let grid = [];
    for(let i = 0; i < this.state.height; i++) {
      let row = [];
      for(let j = 0; j < this.state.width; j++) {
        row.push(<div className='Custom-square' id={i+','+j} onClick={this.clickTile}> </div>)
      }
      grid.push(<div className='Custom-row'> {row} </div>);
    }

    return (
      <>
        <NavBar/>
        <div className='Custom-container'>
            <div className='Custom-mapContainer'>
              {grid}
            </div>
            <div className='Custom-settingsContainer'>
              <div className='u-heading u-textCenter' style={{marginBottom: 16}}> — SETTINGS — </div>
                <div> Map Width: {this.state.width} </div>
                <input type='range' id='width' name='width' min='1' max='50' value={this.state.width} onChange={this.changeWidth}></input>
                <div> Map Height: {this.state.height} </div>
                <input type='range' id='height' name='height' min='1' max='50' value={this.state.height} onChange={this.changeHeight}></input>
                <div> Add Map Elements </div>
                <div className='Custom-elements'>
                  <div className='Custom-wall' onClick={this.wallDescrip}> </div>
                  <div className='Custom-'> </div>
                  <div className='Custom-'> </div>
                  <div className='Custom-'> </div>
                </div>
                <div className='Custom-elementDescrip'> {this.state.description} </div>
                <div className='u-button'> S A V E </div>
            </div>
        </div>

      </>
    );
  }
}

export default Custom;
