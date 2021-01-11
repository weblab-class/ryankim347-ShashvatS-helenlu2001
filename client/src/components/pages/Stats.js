import { navigate } from "@reach/router";
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Stats.css";
/**
 * @param userId specifies the id of the currently logged in user 
 */

const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";


class Stats extends Component {
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
        <div className='Stats-container'>
          <div className = 'Stats-picContainer'>
            <div className='Stats-pic' style={{backgroundImage: 'url(' + this.props.img + ')'}}> </div>
            <div className='Stats-profContainer'> 
              <div className='Stats-user u-hollow'> H E L U </div>
              <div className='Stats-name'> {this.props.name} </div>
            </div>
          </div>
          <hr/>
          <div className='Stats-statContainer'>
            <div className='Stats-stat'>
              <div className='Stats-number'> 700 </div>
              <div className='Stats-category'> games </div>
            </div>
            <div className='Stats-stat'>
              <div className='Stats-number'> 800 </div>
              <div className='Stats-category'> points </div>
            </div>
            <div className='Stats-stat'>
              <div className='Stats-number'> 200 </div>
              <div className='Stats-category'> wins </div>
            </div>
          </div>

          <GoogleLogout  
              render={renderProps => (
                <div className='u-button' onClick={renderProps.onClick}> E X I T </div>
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
