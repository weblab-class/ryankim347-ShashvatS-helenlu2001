class Player {
  constructor(me, x, y, color, dodgeX=0, dodgeY=0, shoot, shootX, shootY, isDead, powerups, r) {
    this.me = me;
    this.r = r;
    this.x = x;
    this.y = y;
    this.color = color;

    this.shoot = shoot;
    this.shootX = shootX;
    this.shootY = shootY;

    this.dodgeX = dodgeX;
    this.dodgeY = dodgeY;

    this.isDead = isDead;
    this.powerups = powerups;
  }

  draw(ctx, playerX, playerY) {
    if(this.isDead) {
      return;
    }
    ctx.beginPath();
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color
    if(this.me) {
      ctx.fillStyle = this.powerups.invisible ? '#383838': this.color;
    } else {
      ctx.fillStyle = this.powerups.invisible ? 'black': this.color;
    }
    ctx.arc(this.x-playerX+2*this.r*this.dodgeX, this.y-playerY+2*this.r*this.dodgeY, this.r, 0, 2 * Math.PI);
    ctx.fill();
    if(this.me) {
      ctx.rect(this.x-playerX-3*this.r,this.y-playerY-3*this.r, 6*this.r,6*this.r)
      ctx.strokeStyle = "this.color"
      ctx.stroke()
    }
    ctx.shadowBlur = 0
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
