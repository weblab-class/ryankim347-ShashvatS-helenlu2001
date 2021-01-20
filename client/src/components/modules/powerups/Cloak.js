class Cloak {
  constructor(x, y, s=40) {
    // coordinates of the top left corner
    this.x = x;
    this.y = y;

    // side length of block
    this.s = s;
    this.color = 'grey'
  }

  draw(ctx, playerX, playerY) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x-playerX, this.y-playerY, this.s, this.s);
    ctx.fillStyle = 'black';
  }

  topLeft() {
    return [this.x, this.y];
  }

  side() {
    return this.s;
  }


}

export default Cloak;
