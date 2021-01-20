class Player {
  constructor(me, x, y, color, shoot, shootX, shootY, isDead, powerups) {
    this.me = me;
    this.r = 12;
    this.x = x;
    this.y = y;
    this.color = color;

    this.shoot = shoot;
    this.shootX = shootX;
    this.shootY = shootY;

    this.isDead = isDead;
    this.powerups = powerups;
  }

  draw(ctx, playerX, playerY) {
    if(this.isDead) {
      return;
    }
    ctx.beginPath();
    if(this.me) {
      ctx.fillStyle = this.powerups.invisible ? '#383838': this.color;

    } else {
      ctx.fillStyle = this.powerups.invisible ? 'black': this.color;
    }
    ctx.arc(this.x-playerX, this.y-playerY, this.r, 0, 2 * Math.PI);
    ctx.fill();

    if(this.shoot) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.moveTo(this.x-playerX, this.y-playerY);
      ctx.lineTo(this.x-playerX + this.shootX*150, this.y-playerY + this.shootY*150);
      ctx.stroke();
    }

    ctx.fillStyle = "black";
  }

  x() {
    return this.x;
  }

  y() {
    return this.y;
  }

  isInvisible() {
    return this.powerups.invisible;
  }
}

export default Player;
