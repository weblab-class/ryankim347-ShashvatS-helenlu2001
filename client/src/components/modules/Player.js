const speed = 2;

class Player {
  constructor() {
    this.r = 12;
    this.x = 300;
    this.y = 300;
    this.color = 'pink'
  }

  move(dx, dy) {
    this.x += speed*dx;
    this.y += speed*dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
  }
}

export default Player;
