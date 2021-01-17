const speed = 10;

class Bullet {
  constructor(posX, posY, velX, velY, color) {
    this.length = 20;
    this.x = posX;
    this.y = posY;
    this.color = color;

    this.velX = velX;
    this.velY = velY;

    this.stillGoing = true;
  }

  move(blocks, players) {
    if(!this.stillGoing) {
      return;
    }

    this.x += speed * this.velX;
    this.y += speed * this.velY;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      this.checkBlockCollision(block.topLeft()[0], block.topLeft()[1], block.side());
    }

    for(let i = 0; i < players.length; i++) {
      let player = players[i];
      if(player.color === this.color || player.isDead) {
        continue;
      } else {
        this.checkPlayerCollision(player);
      }
    }


  }
  // TODO: need to handle case when we have a kabob when shooting -- should only kill the person that is closest
  shoot(players) {
    if(!this.stillGoing) {
      return;
    }

    this.shot = true;
    for(let i = 0; i < players.length; i++) {
      let player = players[i];
      if(player.color === this.color || player.isDead) {
        continue;
      }
      if(this.checkKilled(player)) {
        this.points += 1;
        break;
      }
    }

    setTimeout(() => this.shot = false, 250); // shoots for 0.5 sec
  }

  killed() {
    this.stillGoing = false;
  }

  // inspired by: https://cscheng.info/2016/06/09/calculate-circle-line-intersection-with-javascript-and-p5js.html
  checkKill(player) {
    let h = player.x;
    let k = player.y;

    let m = this.velY / this.velX;
    let n = this.y - m*this.x;

    let a = 1 + m*m;
    let b = -h*2 + (m*(n-k)) * 2;
    let c = h*h + (n-k)*(n-k) - this.r*this.r;

    let d = b*b - 4*a*c;
    if(d >= 0) {
      let x = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
      let y = m*x + n;

      if(this.distFromCenter(x,y) < 150) {
        player.killed();
        return true;
      }
    }

    if(d > 0) {
      let x2 = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
      let y2 = m*x2 + n;

      if(this.distFromCenter(x2,y2) < 150) {
        player.killed();
        return true;
      }
    }

    return false;

  }

  distFromCenter(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return Math.sqrt(dx*dx + dy*dy);
  }

  // inspired by http://www.jeffreythompson.org/collision-detection/circle-rect.php
  // TODO: basically done, but small glitch at the corner
  checkBlockCollision(left, top, side) {
    let compX = this.x;
    let compY = this.y;

    if (compX < left) {
      compX = left;
    } else if (compX > left + side) {
      compX = left + side;
    }

    if (compY < top) {
      compY = top;
    } else if (compY > top + side) {
      compY = top + side;
    }

    let dx = compX - this.x;
    let dy = compY - this.y;

    // collision if this condition holds
    if (dx * dx + dy * dy < this.r * this.r) {
      // adjust x based on which edge we're comparing
      if (compX == left) {
        this.x = compX - this.r;
      } else if (compX == left + side) {
        this.x = compX + this.r;
      }

      // adjust y based on which edge we're comparing
      if (compY == top) {
        this.y = compY - this.r;
      } else if (compY == top + side) {
        this.y = compY + this.r;
      }
    }
  }

  checkPlayerCollision(other) {
    if(other.isDead) {
      return;
    }
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let dist = Math.sqrt(dx*dx + dy*dy);

    if( dist < 24) {
      let overlap = 0.5*(dist-24);

      this.x += overlap * dx / dist;
      this.y += overlap * dy / dist;

      other.x -= overlap * dx / dist;
      other.y -= overlap * dy / dist;

    }

  }
}

module.exports = { Bullet };
