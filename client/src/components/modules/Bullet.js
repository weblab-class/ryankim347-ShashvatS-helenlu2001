class Bullet {
  constructor(x, y,velX,velY,color, isDead) {
    this.len = 10;
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.isDead = isDead;
  }

  draw(ctx, playerX, playerY) {
    if(this.isDead) {
      return;
    }
    let alpha = ctx.globalAlpha
    ctx.lineCap = "round"
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x-playerX -this.velX*this.len, this.y-playerY-this.velY*this.len)
    ctx.lineTo(this.x-playerX +this.velX*this.len, this.y-playerY+this.velY*this.len)
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = alpha
  }

  x() {
    return this.x;
  }

  y() {
    return this.y;
  }
}

export default Bullet;
