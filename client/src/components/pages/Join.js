import { navigate } from "@reach/router";
import React, { Component } from "react";
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
    };

    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onJoin = this.onJoin.bind(this);
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

  async onCreate(_e) {
    const { code } = await post("/api/create");

    navigate(`/lobby/${code}`);
  }

  onJoin(e) {
    let code = this.state.code;
    if (code.length == 6) {
      get("/api/code", { code: code }).then((res) => {
        if (res.length != 0) {
          navigate("/" + code + "/lobby");
        } else {
          this.setState({ code: "" });
        }
      });
    }
  }

  render() {
    return (
      <>
        <div className="Join-container">
          <div className="Join-titleContainer">
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
