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
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.x-playerX -this.velX*this.len, this.y-playerY-this.velY*this.len)
    ctx.lineTo(this.x-playerX +this.velX*this.len, this.y-playerY+this.velY*this.len)
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.fillStyle = "black";
  }

  x() {
    return this.x;
  }

  y() {
    return this.y;
  }
}

export default Bullet;
