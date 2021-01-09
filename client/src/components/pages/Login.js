import { navigate } from "@reach/router";
import React, { Component } from "react";

import "../../utilities.css";
import "./Login.css";
/**
 * @param userId specifies the id of the currently logged in user 
 */


class Login extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {

    };
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onClick(event) {
    navigate("/join");
  }



  render() {

    return (
      <>
        <div className='Login-container'>
            <div className='Login-titleContainer'>
                <div className='Login-title'> L A Z E R T A G </div>
                <div className='Login-buttonContainer'>
                  <div className='Login-button' onClick={this.onClick}> E N T E R </div>
                </div>
            </div>
        </div>

      </>
    );
  }
}

export default Login;
