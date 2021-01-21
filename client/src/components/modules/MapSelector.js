import React, { Component } from "react";
import "../../utilities.css";
import "./MapSelector.css";
import '../pages/Lobby.css';
import { get, post } from "../../utilities.js";


class MapSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: true,
      currMap: 1,
      width: 0,
      height: 0,
      blocks: new Set(),
      name: '',

      maps: [],
    };

    this.previewMap = this.previewMap.bind(this);
  }

  componentDidMount() {
    get('/api/customMaps', {userId: this.props.userId}).then((res) => this.setState({maps: res.data}));
  }

  previewMap(e) {
    let mapID = e.currentTarget.id;
    let map = this.state.maps[mapID];

    let blocks = new Set();
    for(let i = 0; i < map.x.length; i++) {
      blocks.add(map.x[i]+','+map.y[i]);
    }

    this.setState({
      currMap: mapID,
      name: map.name,
      width: map.width,
      height: map.height,
      blocks: blocks,
      hide: (mapID !== this.state.currMap || !this.state.hide) && !(this.state.width === 0)
    });
  }

  render() {
    console.log(this.state.maps);
    let entries = [];
    for(let i = 0; i < this.state.maps.length; i++) {
      let map = this.state.maps[i];
      entries.push(
        <div className='MapSelector-entry' id={i} onClick={this.previewMap}>
          <div className='MapSelector-mapName'> {map.name}<span className='MapSelector-info'>, {map.height}x{map.width} </span> </div>
          <div className='MapSelector-info u-italic'> created by {map.creatorName}</div>
        </div>
      );
    }

    let grid = [];
    for(let i = 0; i < this.state.height; i++) {
      let row = [];
      for(let j = 0; j < this.state.width; j++) {
        row.push(<div className='Lobby-square' style={ this.state.blocks.has(i+','+j) ? {backgroundColor: 'white'} : {backgroundColor: 'black'}}> </div>)
      }
      grid.push(<div className='Lobby-row'> {row} </div>);
    }

    return (
      <>
        <div className='MapSelector-container'>
          <div className='u-heading u-textCenter' style={{marginBottom: 16}}> — BROWSE MAPS — </div>
          <div className='MapSelector-entries'>
            {entries}
          </div>
          <div className='Lobby-settingTitle'> Map Preview: </div>
          <div className='Lobby-gridContainer'>
            {!this.state.hide && grid}
          </div>
          <div className='u-spacer'> </div>
          {<div className='Lobby-mapType u-button2' style={{width: '50%', margin: '0 auto'}} onClick={() => this.props.selectMap(this.state.name, this.state.width, this.state.height, this.state.blocks)}> Select this Map  </div>}

        </div>

      </>
    );
  }
}

export default MapSelector;
