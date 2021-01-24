// const { bulletTimer } = require("../config");

// const speed = 2;
// const respawnTime = 5;

const segmentCircleIntersect = (x1, y1, x2, y2, xc, yc, r) => {
  let ACx = xc - x1;
  let ACy = yc - y1;
  let BCx = xc - x2;
  let BCy = yc - y2;
  let ABx = x2 - x1;
  let ABy = y2 - y1;
  let AB = Math.sqrt(ABx * ABx + ABy * ABy);
  let BC = Math.sqrt(BCx * BCx + BCy * BCy);
  let AC = Math.sqrt(ACx * ACx + ACy * ACy);
  //first check if either endpoint is inside
  if (AC <= r || BC <= r) {
    return true;
  }
  //i dont think this next part is actually necessary but it's cool, check for other intersections with circle
  let proj = (ACx * ABx + ACy * ABy) / AB;
  if (proj < 0 || proj > AB) {
    return false;
  }
  let unitX = ABx / AB;
  let unitY = ABy / AB;
  let Dx = x1 + unitX * proj;
  let Dy = y1 + unitY * proj;
  let dist = Math.sqrt((Dx - xc) * (Dx - xc) + (Dy - yc) * (Dy - yc));
  if (dist > r) {
    return false;
  }
  return true;
};
class Player {
  constructor(name, posX, posY, dodgeX, dodgeY, color, settings, respawnPoints) {
    this.poseDist = 2;
    this.name = name;
    this.r = settings.size;
    this.x = posX;
    this.y = posY;
    this.color = color;
    this.dodgeX = dodgeX;
    this.dodgeY = dodgeY;

    this.points = 0;
    this.deaths = 0;

    this.velX = 0;
    this.velY = 0;
    this.speed = settings.speed * 2;

    this.powerups = {
      invisible: false,
    };

    this.isDead = false;
    this.ticksUntilAlive = -1;
    this.respawn = settings.respawn * 1000;

    this.respawnPoints = respawnPoints;

    this.bulletTimer = Date.now();
    this.cooldown = settings.cooldown * 1000;

    // //TODO: the way this is implemented needs to be changed
    // setInterval(() => {
    //   this.ticksUntilAlive -= 1;
    //   console.log(this.color + "'s ticks until alive:  " + this.ticksUntilAlive);
    //   if (this.ticksUntilAlive === 0) {
    //     this.isDead = false;
    //     let idx = Math.floor(Math.random() * 15);

    //     this.x = this.respawnPoints[idx][0];
    //     this.y = this.respawnPoints[idx][1];
    //     this.velX = 0;
    //     this.velY = 0;
    //   }
    // }, 1000);
  }
  setDodge(x, y) {
    this.dodgeX = x;
    this.dodgeY = y;
  }

  move(blocks, players, bullets, points, powerups) {
    if (this.isDead) {
      if (Date.now() - this.respawnTimer > this.respawn) {
        this.isDead = false;
        this.velX = 0;
        this.velY = 0;

        let idx = Math.floor(Math.random() * this.respawnPoints.length);
        this.x = this.respawnPoints[idx][0];
        this.y = this.respawnPoints[idx][1];
      } else {
        return;
      }
    }

    this.x += this.speed * this.velX;
    this.y += this.speed * this.velY;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      this.checkBlockCollision(block.topLeft()[0], block.topLeft()[1], block.side());
    }

    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      if (player.color === this.color || player.isDead) {
        continue;
      } else {
        this.checkPlayerCollision(player);
      }
    }

    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      if (bullet) {
        this.checkBullet(bullet, points);
      }
    }

    for (let i = 0; i < powerups.length; i++) {
      let powerup = powerups[i];
      if (powerup === undefined) {
        continue;
      }
      if (powerup.isUsed()) {
        continue;
      }
      if (this.checkPowerUp(powerup.topLeft()[0], powerup.topLeft()[1], powerup.side())) {
        powerup.use();
        switch (powerup.type) {
          case "cloak":
            this.powerups.invisible = true;
            setTimeout(() => {
              this.powerups.invisible = false;
            }, 15 * 1000);
            break;
          case "speed":
            this.speed *= 2;
            setTimeout(() => {
              this.speed /= 2;
            }, 15 * 1000);
            break;
          case "shrink":
            this.r -= 2;
            setTimeout(() => {
              this.r += 2;
            }, 15 * 1000);
            break;
        }
      }
    }
  }

  canShoot() {
    return Date.now() - this.bulletTimer > this.cooldown && !this.isDead;
  }

  // TODO: need to handle case when we have a kabob when shooting -- should only kill the person that is closest
  shoot() {
    if (!this.canShoot()) {
      return;
    }

    this.bulletTimer = Date.now();
  }

  killed() {
    this.deaths += 1;
    this.isDead = true;
    this.respawnTimer = Date.now();
  }

  checkBullet(bullet, points) {
    let x1 = bullet.x - bullet.length * bullet.velX;
    let y1 = bullet.y - bullet.length * bullet.velY;
    let x2 = bullet.x + bullet.length * bullet.velX;
    let y2 = bullet.y + bullet.length * bullet.velY;
    if (
      segmentCircleIntersect(
        x1,
        y1,
        x2,
        y2,
        this.x + this.dodgeX * this.r * this.poseDist,
        this.y + this.dodgeY * this.r * this.poseDist,
        this.r
      ) &&
      bullet.color != this.color &&
      !this.isDead
    ) {
      this.killed();
      points.push(bullet.color);
    }
  }

  setVel(x, y) {
    this.velX = x;
    this.velY = y;
  }

  // inspired by http://www.jeffreythompson.org/collision-detection/circle-rect.php
  // TODO: basically done, but small glitch at the corner
  checkBlockCollision(left, top, side, powerup = false) {
    let compX = this.x + this.dodgeX * this.r * this.poseDist;
    let compY = this.y + this.dodgeY * this.r * this.poseDist;

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

  // inspired by https://www.youtube.com/watch?v=LPzyNOHY3A4
  checkPlayerCollision(other) {
    if (other.isDead || this.isDead) {
      return;
    }
    let dx = other.x - this.x - this.dodgeX * this.r * this.poseDist;
    let dy = other.y - this.y - this.dodgeY * this.r * this.poseDist;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 24) {
      let overlap = 0.5 * (dist - 24);

      this.x += (overlap * dx) / dist;
      this.y += (overlap * dy) / dist;

      other.x -= (overlap * dx) / dist;
      other.y -= (overlap * dy) / dist;
    }
  }

  checkPowerUp(left, top, side) {
    let compX = this.x + this.dodgeX * this.r * this.poseDist;
    let compY = this.y + this.dodgeY * this.r * this.poseDist;

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
    let dist = dx * dx + dy * dy;

    // collision if this condition holds
    if (dist < this.r * this.r && dist !== 0) {
      return true;
    }

    return false;
  }
}

module.exports = { Player };
