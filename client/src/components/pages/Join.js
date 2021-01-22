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
    this.setState({ code: code.toUpperCase() });
  }

  onNameChange(e) {
    const name = e.target.value;
    this.setState({ name: name.toLowerCase() });
  }

  async onCreate(_e) {
    if (this.state.name.length == 0) return;

    const { code } = await post("/api/create", {
      name: this.state.name,
    });

    this.props.changeRoom(code);

    navigate("/lobby", { state: { name: this.state.name } });
  }

  async onJoin(_e) {
    if (this.state.name.length == 0) return;

    const code = this.state.code;
    if (code.length == 6) {
      const response = await post("/api/join", {
        name: this.state.name,
        code: this.state.code,
      });

      if (response.success === true) {
        this.props.changeRoom(code);
        navigate("/lobby", { state: { name: this.state.name } });
      } else {
        console.log("error in joining room");
        console.log(response.reason);
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
                <div> win as many points as possible by tagging others with your laser </div>
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
                <li>point mouse in the direction to move towards</li>
                <li>
                  press <span className="Join-spacebar"> SPACEBAR</span> to shoot your laser
                </li>
              </ul>
            </div>
            <hr style={{ margin: 0, marginTop: 4, height: 0.5, border: "none" }} />
            <div className="Join-row">
              <div className="Join-field" style={{ flexGrow: 1, borderRight: "1px solid white" }}>
                <div className="Join-fieldTitle"> Powerups </div>
                <ul>
                  <li> invisiblity </li>
                  <li> speed up </li>
                  <li> shrink</li>
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
