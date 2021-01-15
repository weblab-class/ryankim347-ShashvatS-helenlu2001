const { Block } = require("./Block");
const fs = require('fs');

class Map {
  constructor(num) {
    this.mapNum = num
    //let blocks = fs.readFileSync('./map' + this.mapNum.toString() + '.txt').split("\n");
  }
}



module.exports = {
  Map,
};
