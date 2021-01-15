import { Link, navigate } from "@reach/router";
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "../../utilities.css";
import "./NavBar.css";
/**
 * @param userId specifies the id of the currently logged in user
 */


class NavBar extends Component {
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
    navigate("/game");
  }



  render() {

    return (
      <>
        <div className='NavBar-container'>
            <Link to='/join' className='NavBar-link'> JOIN </Link>
            <Link to='/stats' className='NavBar-link'> STATS </Link>
        </div>

      </>
    );
  }
}

export default NavBar;
