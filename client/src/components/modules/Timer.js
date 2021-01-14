import React, { Component } from "react";

import "./Timer.css";
/**
 * @param userId specifies the id of the currently logged in user
 */


class Timer extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {
      timeLeft: 300
    };
  }

  componentDidMount() {
    // remember -- api calls go here!
    setInterval(() => {
      this.setState({timeLeft: Math.round((5*60*1000 + this.props.startTime - Date.now()) / 1000)});
    }, 500)

  }



  render() {
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = this.state.timeLeft % 60;
    if(seconds < 10) {
      seconds = '0' + seconds;
    }

    return (
      <>
        <div className='Timer-container'>
          {'Time Left | ' + minutes + ':' + seconds}
        </div>

      </>
    );
  }
}

export default Timer;
