import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import "./Lobby.css";
/**
 * @param userId specifies the id of the currently logged in user 
 */


class Stats extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
        creator: true,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
  }



  render() {
    return (
      <>
        <div> in progress, but will be amazing :D </div>

      </>
    );
  }
}

export default Stats;
