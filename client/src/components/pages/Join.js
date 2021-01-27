import { navigate } from "@reach/router";
import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";
import "../../utilities.css";
import "./Join.css";
import { get, post } from "../../utilities.js";

/**
 * @param userId specifies the id of the currently logged in user
 */

class Join extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      code: "",
      name: "",
      errorResponse: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onJoin = this.onJoin.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  onChange(e) {
    let code = e.target.value;
    if (code.length > 6) {
      code = code.substring(0, 6);
    }
    this.setState({ code: code.toUpperCase(), errorResponse: "" });
  }

  onNameChange(e) {
    const name = e.target.value;
    if (name.length > 8) {
      name = name.substring(0, 8);
    }

    this.setState({ name: name.toLowerCase(), errorResponse: "" });
  }

  async onCreate(_e) {
    if (this.state.name.length == 0) {
      this.setState({ errorResponse: "please enter a username" });
      return;
    }
    const { code } = await post("/api/create", {
      name: this.state.name,
    });

    this.props.changeRoom(code);
    navigate("/lobby");
  }

  async onJoin(_e) {
    if (this.state.name.length == 0) {
      this.setState({ errorResponse: "please enter a username" });
      return;
    }

    const code = this.state.code;
    if (code.length == 6) {
      const response = await post("/api/join", {
        name: this.state.name,
        code: this.state.code,
      });

      if (response.success === true) {
        this.props.changeRoom(code);
        navigate("/lobby");
      } else {
        console.log("error in joining room");
        console.log(response.reason);
        this.setState({ errorResponse: response.reason });
      }
    }
  }
  navRules() {
    navigate("/howtoplay");
  }
  // TODO: fix the spacing between the two inputs

  render() {
    return (
      <>
        <NavBar />
        <div className="Join-container">
          <div className="Join-fieldContainer">
            <div className="Join-titleContainer">
              <div style={{ margin: 8, fontSize: 20 }}> {this.state.errorResponse} </div>
              <input
                className="Join-input"
                placeholder="name"
                value={this.state.name}
                onChange={this.onNameChange}
              />
              <br></br>
              <input
                className="Join-input"
                placeholder="enter game code"
                value={this.state.code}
                onChange={this.onChange}
              />
              <div className="Join-spacer"> </div>
              <div className="Join-button" onClick={this.onJoin}>
                {" "}
                J O I N{" "}
              </div>
              <div className="Join-spacer"> </div>
              <div className="Join-button" onClick={this.onCreate}>
                {" "}
                C R E A T E{" "}
              </div>
            </div>
          </div>
          <div className="Join-howTo">
            <div className="u-heading u-textCenter" style={{ marginBottom: 16 }}>
              {" "}
              — HOW TO PLAY —{" "}
            </div>
            <div className="Join-row">
              <div className="Join-field" style={{ flexGrow: 2, borderRight: "1px solid white" }}>
                <div className="Join-fieldTitle"> Goal </div>
                <div> Win as many points as possible by tagging others with your laser! </div>
              </div>
              <div className="Join-field">
                <div className="Join-fieldTitle"> Players </div>
                <div className="u-textCenter"> 2 to 12 </div>
              </div>
            </div>
            <hr style={{ margin: 0, marginTop: 4, height: 1, border: "none" }} />
            <div className="Join-field">
              <div className="Join-fieldTitle"> Gameplay </div>
              <ul>
                <li>Your avatar moves toward where your mouse is</li>
                <li>
                  Press <span className="Join-spacebar"> SPACEBAR</span> to shoot your laser
                </li>
                <li> In POSENET MODE in game settings, move side to side in your webcam's view to dodge bullets</li>
              </ul>
              <div style={{textAlign: 'center', fontSize: 12}}> Note: POSENET MODE is in beta testing and requires webcam access</div>
            </div>
            <hr style={{ margin: 0, marginTop: 4, height: 0.5, border: "none" }} />
            <div className="Join-row">
              <div className="Join-field" style={{ flexGrow: 1, borderRight: "1px solid white" }}>
                <div className="Join-fieldTitle"> Powerups </div>
                <ul>
                  <li style={{color: 'grey'}}> Invisiblity (10 sec)</li>
                  <li style={{color: "var(--nyellow)"}}> Speed (15 sec) </li>
                  <li style={{color: 'red'}}> Shrink (15 sec)</li>
                </ul>
              </div>
              <div className="Join-field" style={{ flexGrow: 1 }}>
                <div className="Join-fieldTitle"> Map Elements </div>
                <ul>
                  <li>
                    {" "}
                    <span>
                      {" "}
                      <div
                        style={{
                          border: "1px solid white",
                          backgroundColor: "white",
                          width: 8,
                          height: 8,
                          marginBottom: 0,
                          marginRight: 4,
                          display: "inline-block",
                        }}
                      >
                        {" "}
                      </div>{" "}
                    </span>{" "}
                    walls stop lasers{" "}
                  </li>
                  <li>
                    {" "}
                    <span>
                      {" "}
                      <div
                        style={{
                          border: "1px solid white",
                          width: 8,
                          height: 8,
                          marginBottom: 0,
                          marginRight: 4,
                          display: "inline-block",
                        }}
                      >
                        {" "}
                      </div>{" "}
                    </span>{" "}
                    mirrors reflect lasers{" "}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Join;

// laser will stop at blocks and bounce off of mirrors (the hollow boxes).
// Also, collect power ups: red makes you smaller and harder to hit, gray makes you slower, and yellow makes you faster.
