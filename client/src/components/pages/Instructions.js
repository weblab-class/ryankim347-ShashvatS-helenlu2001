import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Instructions.css";
/**
 * @param userId specifies the id of the currently logged in user
 */


class Instructions extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
  }

  render() {
    return (
      <>
        <NavBar/>
        <div className='Instructions-container'>
          <div className='Instructions-title'> I N S T R U C T I O N S</div>
          <div className='Instructions-body'>
            Welcome to Astroblasters!  You're centered on the screen, and move toward where your mouse is.  Press the spacebar to shoot your laser: you get a point for tagging other players, and your laser will stop at blocks and bounce off of mirrors (the hollow boxes).
            Also, collect power ups: red makes you smaller and harder to hit, gray makes you slower, and yellow makes you faster.
          </div>
        </div>


      </>
    );
  }
}

export default Instructions;
