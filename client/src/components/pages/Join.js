import { navigate } from "@reach/router";
import React, { Component } from "react";
import "../../utilities.css";
import "./Join.css";
import { get, post } from "../../utilities.js";
import { currentRoom } from "../../global";

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

    currentRoom.room = code;
    navigate("/lobby");
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
        currentRoom.room = code;
        navigate("/lobby");
      } else {
        console.log("error in joining room");
        console.log(response.reason);
      }
    }
  }

  // TODO: fix the spacing between the two inputs

  render() {
    return (
      <>
        <div className="Join-container">
          <div className="Join-titleContainer">
            <input placeholder="name" value={this.state.name} onChange={this.onNameChange} />
            <br></br>
            <input placeholder="enter game code" value={this.state.code} onChange={this.onChange} />
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
      </>
    );
  }
}

export default Join;
