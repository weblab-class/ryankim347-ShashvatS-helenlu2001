import { navigate } from "@reach/router";
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "../../utilities.css";
import "./Login.css";
/**
 * @param userId specifies the id of the currently logged in user 
 */

const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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
  }



  render() {

    return (
      <>
        <div className='Login-container'>
            <div className='Login-titleContainer'>
                <div className='Login-title'> L A Z E R T A G </div>
                <div className='Login-buttonContainer'>                  
                  {this.props.userId ? (
                    <GoogleLogout  
                      clientId={GOOGLE_CLIENT_ID}
                      buttonText="Logout"
                      onLogoutSuccess={this.props.handleLogout}
                      onFailure={(err) => console.log(err)}
                    />
                  ) : (
                    <GoogleLogin
                      render={renderProps => (
                        <div className='u-button' onClick={renderProps.onClick}> E N T E R </div>
                      )}
                      clientId={GOOGLE_CLIENT_ID}
                      buttonText="E N T E R"
                      onSuccess={this.props.handleLogin}
                      onFailure={(err) => console.log(err)}
                    />
                  )}




                </div>
            </div>
        </div>

      </>
    );
  }
}

export default Login;
