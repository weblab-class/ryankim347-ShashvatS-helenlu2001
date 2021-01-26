import React, { Component } from "react";
import { GoogleLogout } from "react-google-login";
import NavBar from "../modules/NavBar.js";

import "../../utilities.css";
import "./Stats.css";
/**
 * @param userId specifies the id of the currently logged in user
 */

const GOOGLE_CLIENT_ID = "127446521312-hdfp7kh60ebsqr209mhunpje0bin3gq8.apps.googleusercontent.com";

class Stats extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      games: 0,
      kills: 0,
      death: 0,
      wins: 0,
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    console.log(this.props);
    console.log("hello");
    // get('/api/stats', {userId: this.props.userId}).then((data) => {
    //   this.setState({
    //     games: data.games,
    //     kills: data.points,
    //     deaths: data.deaths,
    //     wins: data.wins
    //   });
    // });
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="Stats-container">
          <div className="Stats-picContainer">
            <div className="Stats-pic" style={{ backgroundImage: "url(" + this.props.img + ")" }}>
              {" "}
            </div>
            <div className="Stats-profContainer">
              <div className="Stats-user u-hollow"> {this.props.name.toUpperCase()} </div>
            </div>
          </div>
          <hr />
          <div className="Stats-statContainer">
            <div className="Stats-stat">
              <div className="Stats-number"> {this.state.games} </div>
              <div className="Stats-category"> games </div>
            </div>
            <div className="Stats-stat">
              <div className="Stats-number"> {this.state.wins} </div>
              <div className="Stats-category"> wins </div>
            </div>
            <div className="Stats-stat">
              <div className="Stats-number">
                {this.state.deaths === 0 || this.state.deaths === undefined
                  ? 0
                  : this.state.kills / this.state.deaths}
              </div>
              <div className="Stats-category"> k-d ratio </div>
            </div>
          </div>

          <GoogleLogout
            render={(renderProps) => (
              <div className="u-button" onClick={renderProps.onClick}>
                {" "}
                E X I T{" "}
              </div>
            )}
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Logout"
            onLogoutSuccess={this.props.handleLogout}
            onFailure={(err) => console.log(err)}
          />
        </div>
      </>
    );
  }
}

export default Stats;
