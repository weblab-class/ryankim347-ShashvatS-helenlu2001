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
  }

  componentDidMount() {
    // remember -- api calls go here!
  }


  render() {

    return (
      <>
        <div className='NavBar-container'>
            <Link to='/join' className='NavBar-link'> JOIN </Link>
            <Link to='/customize' className='NavBar-link'> CUSTOMIZE </Link>
            <Link to='/stats' className='NavBar-link'> STATS </Link>
        </div>

      </>
    );
  }
}

export default NavBar;
