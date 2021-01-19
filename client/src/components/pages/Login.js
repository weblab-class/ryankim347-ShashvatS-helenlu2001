import { navigate } from "@reach/router";
import { Link } from '@reach/router';
import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "../../utilities.css";
import "./Login.css";
/**
 * @param userId specifies the id of the currently logged in user
 */

const GOOGLE_CLIENT_ID = '127446521312-hdfp7kh60ebsqr209mhunpje0bin3gq8.apps.googleusercontent.com';

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
                    <Link to='/join' className = "u-button Login-specialLink"> {" "}E N T E R{" "} </Link>
                    // <GoogleLogout
                    //   render={renderProps => (
                    //     <div className='u-button' onClick={renderProps.onClick}> L O G O U T</div>
                    //   )}
                    //   clientId={GOOGLE_CLIENT_ID}
                    //   buttonText="Logout"
                    //   onLogoutSuccess={this.props.handleLogout}
                    //   onFailure={(err) => console.log(err)}
                    // />
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
