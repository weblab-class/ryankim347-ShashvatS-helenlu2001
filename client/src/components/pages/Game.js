import React, { Component } from "react";

import Canvas from '../modules/Canvas.js';
import "../../utilities.css";
import "./Game.css";


/**
 * @param userId specifies the id of the currently logged in user 
 */


class Game extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {

    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }



  render() {

    return (
      <>
        <div className='Game-container'>
          <div>game board </div>
          <Canvas className='Game-canvas'/>
        </div>
      </>
    );
  }
}

export default Game;
