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


  // inspired by http://www.jeffreythompson.org/collision-detection/circle-rect.php
  // TODO: basically done, but small glitch at the corner
  checkBlockCollision(left, top, side) {
    let compX = this.x;
    let compY = this.y;

    if(compX < left) {
      compX = left;
    } else if (compX > left + side) {
      compX = left + side;
    }

    if(compY < top) {
      compY = top;
    } else if (compY > top + side) {
      compY = top + side;
    }

    let dx = compX - this.x;
    let dy = compY - this.y;

    // collision if this condition holds
    if( dx*dx + dy*dy < this.r*this.r) {

      // adjust x based on which edge we're comparing
      if(compX == left) {
        this.x = compX - this.r;
      } else if (compX == left + side) {
        this.x = compX + this.r;
      }

      // adjust y based on which edge we're comparing
      if(compY == top) {
        this.y = compY - this.r;
      } else if (compY == top + side) {
        this.y = compY + this.r;
      }
    }

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
