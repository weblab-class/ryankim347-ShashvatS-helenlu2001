class Player {
  constructor() {
    this.x = 300;
    this.y = 300;
    this.dir = [0,1];
    this.color = 'red'
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
  }
}

export default Player;
