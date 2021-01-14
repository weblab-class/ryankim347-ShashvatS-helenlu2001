class Player {
  constructor(x, y, color) {
    this.r = 12;
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
  }

  x() {
    return this.x;
  }

  y() {
    return this.y;
  }
}

export default Player;
