const speed = 2;

class Player {
  constructor(posX, posY, color) {
    this.r = 12;
    this.x = posX;
    this.y = posY;
    this.color = color;

    this.velX = 0;
    this.velY = 0;

    this.isDead = false;
    this.ticksUntilAlive = -1;
  }

  move(blocks) {
    this.x += speed * this.velX;
    this.y += speed * this.velY;

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      this.checkBlockCollision(block.topLeft()[0], block.topLeft()[1], block.side());
    }
  }

  setVel(x, y) {
    this.velX = x;
    this.velY = y;
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
}

module.exports = { Player };